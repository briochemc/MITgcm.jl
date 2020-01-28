

"""
    read_nctiles(fileName,fldName,mygrid)

Read model output from Netcdf / NCTiles file and convert to MeshArray instance.
```
mygrid=GridSpec("LatLonCap")
fileName="nctiles_grid/GRID"
Depth=read_nctiles(fileName,"Depth",mygrid)
hFacC=read_nctiles(fileName,"hFacC",mygrid)
```
"""
function read_nctiles(fileName::String,fldName::String,mygrid::gcmgrid)

if (mygrid.class!="LatLonCap")||(mygrid.ioSize!=[90 1170])
  error("non-llc90 cases not implemented yet");
end;

fileIn=@sprintf("%s.%04d.nc",fileName,1);
x = ncread(fileIn,fldName);
ndims=length(size(x));

#initialize f
if ndims==2;
  f0=Array{Float64}(undef,90,0);
  f00=Array{Float64}(undef,0,90);
elseif ndims==3;
  f0=Array{Float64}(undef,90,0,size(x,3));
  f00=Array{Float64}(undef,0,90,size(x,3));
elseif ndims==4;
  f0=Array{Float64}(undef,90,0,size(x,3),size(x,4));
  f00=Array{Float64}(undef,0,90,size(x,3),size(x,4));
end;
f=[f0,f0,f0,f00,f00];

#fill in f
for ff=1:13;
  #read one tile
  fileIn=@sprintf("%s.%04d.nc",fileName,ff);
  x = ncread(fileIn,fldName);
  #combine tiles
  if ff<=3;
    f[1]=cat(f[1],x;dims=2);
  elseif ff<=6;
    f[2]=cat(f[2],x;dims=2);
  elseif ff==7;
    f[3]=x;
  elseif ff<=10;
    f[4]=cat(f[4],x;dims=1);
  elseif ff<=13;
    f[5]=cat(f[5],x;dims=1);
  end;

end;

fld=MeshArray(mygrid,f)
return fld

end

"""
    findtiles(ni::Int,nj::Int,mygrid::gcmgrid)
    findtiles(ni::Int,nj::Int,grid::String="LatLonCap",GridParentDir="../inputs/GRID_LLC90/")

Return a `MeshArray` map of tile indices, `mytiles["tileNo"]`, for tile
size `ni,nj` and extract grid variables accordingly.
"""
function findtiles(ni::Int,nj::Int,mygrid::gcmgrid)
    mytiles = Dict()

    GridVariables=GridLoad(mygrid)

    mytiles["nFaces"]=mygrid.nFaces;
    mytiles["ioSize"]=mygrid.ioSize;

    XC=GridVariables["XC"];
    YC=GridVariables["YC"];
    XC11=similar(XC); YC11=similar(XC);
    XCNINJ=similar(XC); YCNINJ=similar(XC);
    iTile=similar(XC); jTile=similar(XC); tileNo=similar(XC);
    tileCount=0;
    for iF=1:XC11.grid.nFaces
        face_XC=XC.f[iF]; face_YC=YC.f[iF];
        for jj=Int.(1:size(face_XC,2)/nj);
            for ii=Int.(1:size(face_XC,1)/ni);
                tileCount=tileCount+1;
                tmp_i=(1:ni).+ni*(ii-1)
                tmp_j=(1:nj).+nj*(jj-1)
                tmp_XC=face_XC[tmp_i,tmp_j]
                tmp_YC=face_YC[tmp_i,tmp_j]
                XC11.f[iF][tmp_i,tmp_j].=tmp_XC[1,1]
                YC11.f[iF][tmp_i,tmp_j].=tmp_YC[1,1]
                XCNINJ.f[iF][tmp_i,tmp_j].=tmp_XC[end,end]
                YCNINJ.f[iF][tmp_i,tmp_j].=tmp_YC[end,end]
                iTile.f[iF][tmp_i,tmp_j]=collect(1:ni)*ones(Int,1,nj)
                jTile.f[iF][tmp_i,tmp_j]=ones(Int,ni,1)*collect(1:nj)'
                tileNo.f[iF][tmp_i,tmp_j]=tileCount*ones(Int,ni,nj)
            end
        end
    end

    mytiles["tileNo"] = tileNo;
    mytiles["XC"] = XC;
    mytiles["YC"] = YC;
    mytiles["XC11"] = XC11;
    mytiles["YC11"] = YC11;
    mytiles["XCNINJ"] = XCNINJ;
    mytiles["YCNINJ"] = YCNINJ;
    mytiles["iTile"] = iTile;
    mytiles["jTile"] = jTile;

    return mytiles

end

findtiles(ni::Int,nj::Int,GridName::String="LatLonCap",GridParentDir="../inputs/GRID_LLC90/") = findtiles(ni,nj,GridSpec(GridName,GridParentDir))

"""
    MetaFileRead(filIn::String)

Reads a meta file generated by MITgcm
"""
function MetaFileRead(FileName::String)

    MetaFile=FileName[1:end-5]*".meta"
    f = open(MetaFile)
    lines = readlines(f)
    close(f)

    MetaFile=Dict("MetaFile" => MetaFile)
    while !isempty(lines)
        line=popfirst!(lines)
        i0=findfirst(isequal('='), line)
        i1=findfirst(isequal(';'), line)
        !isnothing(i0) ? nam=strip(line[1:i0-1]) : nam=""
        val=nothing
        #show(line)
        if nam=="dimList"
            #special case: dimList
            val=fill(0.,(MetaFile["nDims"],3))
            for ii=1:MetaFile["nDims"]
                line=popfirst!(lines)
                tmp1=split(line,",")
                #tmp1=map(x->(v = tryparse(Int,x); ismissing(v) ? 0.0 : v),tmp1)
                val[ii,:]=parse.(Int,tmp1[1:3])
            end
            line=popfirst!(lines)
        elseif nam=="fldList"
            #special case: fldList
            line=popfirst!(lines)
            tmp1=split(line,"'")
            val=String.(tmp1[2:2:end])
            line=popfirst!(lines)
        elseif nam=="dataprec"
            #sepcial case: dataprec
            tmp1=split(line)
            tmp1[4]=="'float32'" ? val=Float32 : val=Float64
        elseif nam=="nDims"
            #sepcial case: nDims
            tmp1=split(line[i0+1:i1-1])
            val=parse(Int64,tmp1[2])
        end
        #
        if ~isnothing(val)
            tmp2=Dict(nam => val)
            MetaFile=merge(MetaFile,tmp2)
        end
    end

    return MetaFile
end

"""
    read_SPM(dirIn::String)

Reads pre-computed interpolation (sparse matrix) from
`dirIn*"interp_precomputed.mat"`.
"""
function read_SPM(dirIn::String)
    #vars = matread(dirIn*"interp_precomputed.mat")
    file = matopen(dirIn*"interp_precomputed.mat")
    interp=read(file, "interp")
    lon=read(file, "lon")
    lat=read(file, "lat")
    SPM=interp["SPM"]
    #println(keys(interp))
    close(file)
    return SPM,lon,lat
end

## read_bin function with full list of argument

"""
    read_bin(fil::String,kt::Union{Int,Missing},kk::Union{Int,Missing},prec::DataType,mygrid::gcmgrid)

Read model output from binary file and convert to MeshArray. Other methods:

```
read_bin(fil::String,prec::DataType,mygrid::gcmgrid)
read_bin(fil::String,mygrid::gcmgrid)
```
"""
function read_bin(fil::String,kt::Union{Int,Missing},kk::Union{Int,Missing},prec::DataType,mygrid::gcmgrid)

  if ~ismissing(kt);
    error("non-empty kt option not implemented yet");
  end;

  if ~ismissing(kk);
    error("non-empty kk option not implemented yet");
  end;

  (n1,n2)=mygrid.ioSize

  if prec==Float64;
    reclen=8;
  else;
    reclen=4;
  end;
  tmp1=stat(fil);
  n3=Int64(tmp1.size/n1/n2/reclen);

  fid = open(fil);
  fld = Array{prec,1}(undef,(n1*n2*n3));
  read!(fid,fld);
  fld = hton.(fld);
  close(fid)

  n3>1 ? s=(n1,n2,n3) : s=(n1,n2)
  v0=reshape(fld,s);

  convert2gcmfaces(v0,mygrid)

end

## read_bin with reduced list of argument

# read_bin(fil::String,prec::DataType,mygrid::gcmgrid)
function read_bin(fil::String,prec::DataType,mygrid::gcmgrid)
  read_bin(fil,missing,missing,prec,mygrid::gcmgrid)
end

# read_bin(fil::String,mygrid::gcmgrid)
function read_bin(fil::String,mygrid::gcmgrid)
  read_bin(fil,missing,missing,mygrid.ioPrec,mygrid::gcmgrid)
end

## read_bin with alternative arguments

# read_bin(fil::String,x::MeshArray)
function read_bin(fil::String,x::MeshArray)
  read_bin(fil,missing,missing,eltype(x),x.grid::gcmgrid)
end

# read_bin(tmp::Array,mygrid::gcmgrid)
function read_bin(tmp::Array,mygrid::gcmgrid)
  convert2gcmfaces(tmp,mygrid)
end

# read_bin(tmp::Array,x::MeshArray)
function read_bin(tmp::Array,x::MeshArray)
  convert2gcmfaces(tmp,x.grid)
end
