var documenterSearchIndex = {"docs":
[{"location":"functionalities/#Manual","page":"Manual","title":"Manual","text":"","category":"section"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"MITgcmTools.jl provides a suite of tools for analyzing MITgcm results, compiling the model, modifying its inputs, running simulations, etc.","category":"page"},{"location":"functionalities/#Read-MITgcm-Files","page":"Manual","title":"Read MITgcm Files","text":"","category":"section"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"Parameter Files (text)\nMDSIO Files (binary)\nMNC Files (netcdf)\nOther Files","category":"page"},{"location":"functionalities/#MITgcm-Configurations","page":"Manual","title":"MITgcm Configurations","text":"","category":"section"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"In MITgcmTools.jl, a model configuration is generally formulated as a MITgcm_config struct. The setup function can then be used to set up a temporary run directory for MITgcm_config, which can then simply be run in batch mode or interactively using the ClimateModels.jl interface. ","category":"page"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"verification_experiments provides a list of standard MITgcm configurations found in the verification/ subfolder of MITgcm_path[1], which is also where MITgcm would get compiled. ","category":"page"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"Please refer to the Detail On Configurations and ClimateModels Interface sections for more on this. Interactive notebooks are found in the Examples section (and the examples/ subfolder). ","category":"page"},{"location":"functionalities/#Compile-and-Run-MITgcm","page":"Manual","title":"Compile & Run MITgcm","text":"","category":"section"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"The ClimateModels Interface provides a convenient framework to build and run MITgcm. Additional information about the ClimateModels.jl interface is also available in the ClimateModels.jl docs.","category":"page"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"The MITgcmTools.build and MITgcmTools.launch functions build and run a MITgcm_config after it has been set up. MITgcm_path[1] points to where MITgcm code is installed and will be compiled. MITgcm_config provides the run directory.","category":"page"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"Interactive notebooks are found in the Examples section (and the examples/ subfolder). ","category":"page"},{"location":"functionalities/#More-Functionalities","page":"Manual","title":"More Functionalities","text":"","category":"section"},{"location":"functionalities/","page":"Manual","title":"Manual","text":"Format conversions\nFormulae etc\nAPI Reference","category":"page"},{"location":"functionalities_more/#Format-conversions","page":"-","title":"Format conversions","text":"","category":"section"},{"location":"functionalities_more/","page":"-","title":"-","text":"findtiles\ncube2compact\ncompact2cube\nconvert2array\nconvert2gcmfaces","category":"page"},{"location":"functionalities_more/#MITgcmTools.findtiles","page":"-","title":"MITgcmTools.findtiles","text":"findtiles(ni::Int,nj::Int,mygrid::gcmgrid)\nfindtiles(ni::Int,nj::Int,grid::String=\"LatLonCap\",GridParentDir=\"../inputs/GRID_LLC90/\")\n\nReturn a MeshArray map of tile indices, mytiles[\"tileNo\"], for tile size ni,nj and extract grid variables accordingly.\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#MITgcmTools.cube2compact","page":"-","title":"MITgcmTools.cube2compact","text":"cube2compact(x::Array)\n\nReshape from e.g. size (192, 32, 5) in cube format to (32, 192, 5) in compact format.\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#MITgcmTools.compact2cube","page":"-","title":"MITgcmTools.compact2cube","text":"compact2cube(x::Array)\n\nReshape from e.g. size (32, 192, 5) in cube format to (192, 32, 5) in compact format.\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#MITgcmTools.convert2array","page":"-","title":"MITgcmTools.convert2array","text":"convert2array(fld::MeshArray)\n\nConvert MeshArray to Array (or vice versa otherwise)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#MITgcmTools.convert2gcmfaces","page":"-","title":"MITgcmTools.convert2gcmfaces","text":"convert2gcmfaces(fld::MeshArray)\n\nConvert mitgcm output to MeshArray (or vice versa otherwise)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#Formulae-etc","page":"-","title":"Formulae etc","text":"","category":"section"},{"location":"functionalities_more/","page":"-","title":"-","text":"SeaWaterDensity\nMixedLayerDepth","category":"page"},{"location":"functionalities_more/#MITgcmTools.SeaWaterDensity","page":"-","title":"MITgcmTools.SeaWaterDensity","text":"SeaWaterDensity(Θ,Σ,Π,Π0)\n\nCompute potential density (ρP), in situ density (ρI), and density referenced to PREF (Π0 in decibars) from potential temperature (Θ in °C), salinity (Σ in psu) and pressure (Π in decibars) according to the UNESCO / Jackett & McDougall 1994 equation of state.\n\nCredits: code based on a Matlab implementation by B. Ferron Reference: https://www.jodc.go.jp/info/iocdoc/UNESCOtech/059832eb.pdf Check value: ρI = 1041.83267kg/m^3 for Θ=3°Celcius, Σ=35psu, Π=3000dbar\n\n(ρP,ρI,ρR) = SeaWaterDensity(3.,35.5,3000.)\nisapprox(ρI,1041.83267, rtol=1e-6)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#MITgcmTools.MixedLayerDepth","page":"-","title":"MITgcmTools.MixedLayerDepth","text":"MixedLayerDepth(Θ,Σ,Δ,mthd)\n\nCompute mixed layer depth from potential temperature (Θ in °C), salinity (Σ in psu) and depth (Δ in method) according to various formulas (mthd == \"BM\", \"Suga\", \"Kara\"). Inputs must be dense vectors without any missing value (or NaN, etc).\n\nD=collect(0.0:1.0:500.0); tmp=(1.0.-tanh.(5*(-1 .+ 2/D[end]*D)));\nT=2.0 .+ 8.0*tmp; S=34.0 .+ 0.5*tmp;\n(ρP,ρI,ρR) = SeaWaterDensity(T,S,D);\n\nmld=MixedLayerDepth(T,S,D,\"BM\"); isapprox(mld,134.0)\n\nusing Plots\nplot(ρP,-D,w=2,label=\"Potential Density\",ylabel=\"Depth\")\nplot!(vec([ρP[1] ρP[end]]),-fill(mld,2),label=\"Mixed Layer Depth\",w=2,c=\"black\",s=:dash)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_more/#API-Reference","page":"-","title":"API Reference","text":"","category":"section"},{"location":"functionalities_more/","page":"-","title":"-","text":"","category":"page"},{"location":"functionalities_read/#Parameter-Files","page":"-","title":"Parameter Files","text":"","category":"section"},{"location":"functionalities_read/","page":"-","title":"-","text":"MITgcm_namelist\nread_namelist\nwrite_namelist","category":"page"},{"location":"functionalities_read/#MITgcmTools.MITgcm_namelist","page":"-","title":"MITgcmTools.MITgcm_namelist","text":"MITgcm_namelist(groups,params)\n\nData structure representing a MITgcm namelist file, such as data.pkg, which contains \n\n    groups :: Array{Symbol,1} = Array{Symbol,1}(undef, 0)\n    params :: Array{OrderedDict{Symbol,Any},1} = Array{OrderedDict{Symbol,Any},1}(undef, 0)\n\nwith model parameters (params) being organized in groups as done in the files.\n\nusing MITgcmTools\nfil=joinpath(MITgcm_path[1],\"verification\",\"advect_xy\",\"run\",\"data\")\nnml=read_namelist(fil)\nMITgcm_namelist(nml.groups,nml.params)\nMITgcm_namelist(groups=nml.groups,params=nml.params)\nMITgcm_namelist(groups=nml.groups)\n\n\n\n\n\n","category":"type"},{"location":"functionalities_read/#MITgcmTools.read_namelist","page":"-","title":"MITgcmTools.read_namelist","text":"read_namelist(fil)\n\nRead a MITgcm namelist file, parse it, and return as a NamedTuple\n\nusing MITgcmTools\ntestreport(\"advect_xy\")\nfil=joinpath(MITgcm_path[1],\"verification\",\"advect_xy\",\"run\",\"data\")\nnamelist=read_namelist(fil)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.write_namelist","page":"-","title":"MITgcmTools.write_namelist","text":"write_namelist(fil)\n\nSave a MITgcm namelist file. In the example below, one is read from file, modified, and then saved to a new file using write_namelist.\n\nusing MITgcmTools\nfil=joinpath(MITgcm_path[1],\"verification\",\"advect_xy\",\"run\",\"data\")\nnml=read_namelist(fil)\nwrite_namelist(fil*\"_new\",namelist)\n\nor \n\nnml=read(fil,MITgcm_namelist())\nwrite(fil*\"_new\",nml)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MDSIO-Files","page":"-","title":"MDSIO Files","text":"","category":"section"},{"location":"functionalities_read/","page":"-","title":"-","text":"read_mdsio\nread_meta\nGridLoad_mdsio","category":"page"},{"location":"functionalities_read/#MITgcmTools.read_mdsio","page":"-","title":"MITgcmTools.read_mdsio","text":"read_mdsio(datafile)\n\nRead a MITgcm mdsio file (\".data\" binary + \".meta\" text pair), and return as an Array\n\np=\"./hs94.cs-32x32x5/run/\"\nx=read_mdsio(p*\"surfDiag.0000000020.002.001.data\")\ny=read_mdsio(p*\"pickup.ckptA.002.001.data\")\nz=read_mdsio(p*\"T.0000000000.002.001.data\")\n\n\n\n\n\nread_mdsio(pth::String,fil::String)\n\nRead a MITgcm's MDSIO files (\".data\" binary + \".meta\" text pair), combine, and return as an Array\n\np=\"./hs94.cs-32x32x5/run/\"\nx=read_mdsio(p,\"surfDiag.0000000020\")\ny=read_mdsio(p,\"pickup.ckptA\")\nz=read_mdsio(p,\"T.0000000000\")\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.read_meta","page":"-","title":"MITgcmTools.read_meta","text":"read_meta(metafile)\n\nRead a MITgcm metadata file, parse it, and return as a NamedTuple\n\np=\"./hs94.cs-32x32x5/run/\"\nmeta=read_meta(p*\"surfDiag.0000000020.002.001.meta\")\npairs(meta)\nmeta.dimList\n\n\n\n\n\nread_meta(pth::String,fil::String)\n\nRead a MITgcm metadata files, parse them, and return as an array of NamedTuple\n\np=\"./hs94.cs-32x32x5/run/\"\nmeta=read_meta(p,\"surfDiag.0000000020\")\npairs(meta[end])\n[meta[i].dimList for i in 1:length(meta)]\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.GridLoad_mdsio","page":"-","title":"MITgcmTools.GridLoad_mdsio","text":"GridLoad_mdsio(myexp::MITgcm_config)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MNC-Files","page":"-","title":"MNC Files","text":"","category":"section"},{"location":"functionalities_read/","page":"-","title":"-","text":"read_mnc\nGridLoad_mnc","category":"page"},{"location":"functionalities_read/#MITgcmTools.read_mnc","page":"-","title":"MITgcmTools.read_mnc","text":"read_mnc(pth::String,fil::String,var::String)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.GridLoad_mnc","page":"-","title":"MITgcmTools.GridLoad_mnc","text":"GridLoad_mnc(γ::gcmgrid)\n\n\n\n\n\nGridLoad_mnc(myexp::MITgcm_config)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#Other-Files","page":"-","title":"Other Files","text":"","category":"section"},{"location":"functionalities_read/","page":"-","title":"-","text":"scan_rundir\nread_available_diagnostics\nread_flt\nread_bin\nread_nctiles","category":"page"},{"location":"functionalities_read/#MITgcmTools.scan_rundir","page":"-","title":"MITgcmTools.scan_rundir","text":"scan_rundir(pth::String)\n\nScan a MITgcm run directory and standard output text file  (\"output.txt\" or \"STDOUT.0000\") and return a NamedTuple of collected information (various formats)\n\nInitially, the output looked like (grid=gr,packages=pac,params_time=par1,params_grid=par2,completed=co)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.read_available_diagnostics","page":"-","title":"MITgcmTools.read_available_diagnostics","text":"read_available_diagnostics(fldname::String; filename=\"available_diagnostics.log\")\n\nGet the information for a particular variable fldname from the  available_diagnostics.log text file generated by MITgcm.\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.read_flt","page":"-","title":"MITgcmTools.read_flt","text":"read_flt(dirIn::String,prec::DataType)\n\nRead displacements from MITgcm/pkg/flt output file into a DataFrame.\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.read_bin","page":"-","title":"MITgcmTools.read_bin","text":"read_bin(fil::String,kt::Union{Int,Missing},kk::Union{Int,Missing},prec::DataType,mygrid::gcmgrid)\n\nRead model output from binary file and convert to MeshArray. Other methods:\n\nread_bin(fil::String,prec::DataType,mygrid::gcmgrid)\nread_bin(fil::String,mygrid::gcmgrid)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_read/#MITgcmTools.read_nctiles","page":"-","title":"MITgcmTools.read_nctiles","text":"read_nctiles(fileName,fldName,mygrid)\n\nRead model output from NCTiles file and convert to MeshArray instance.\n\nmygrid=GridSpec(\"LatLonCap\")\nfileName=\"nctiles_grid/GRID\"\nDepth=read_nctiles(fileName,\"Depth\",mygrid)\nhFacC=read_nctiles(fileName,\"hFacC\",mygrid)\nhFacC=read_nctiles(fileName,\"hFacC\",mygrid,I=(:,:,1))\n\n\n\n\n\n","category":"function"},{"location":"functionalities_configurations/","page":"-","title":"-","text":"using MITgcmTools # hide\nMITgcm_path[1]","category":"page"},{"location":"functionalities_configurations/#Detail-On-Configurations","page":"-","title":"Detail On Configurations","text":"","category":"section"},{"location":"functionalities_configurations/","page":"-","title":"-","text":"MITgcm_path\nverification_experiments\nMITgcm_config","category":"page"},{"location":"functionalities_configurations/#MITgcmTools.MITgcm_path","page":"-","title":"MITgcmTools.MITgcm_path","text":"MITgcm_path\n\nPath to a MITgcm folder. MITgcm_path[1] should generally be used. MITgcm_path[2] is mostly  meant to facilitate comparisons between e.g. MITgcm releases when needed.\n\n\n\n\n\n","category":"constant"},{"location":"functionalities_configurations/#MITgcmTools.verification_experiments","page":"-","title":"MITgcmTools.verification_experiments","text":"verification_experiments()\n\nGet list of all most-standard configurations of MITgcm and return as an Array of MITgcm_config\n\nusing MITgcmTools\nexps=verification_experiments()\n\n\n\n\n\n","category":"function"},{"location":"functionalities_configurations/#MITgcmTools.MITgcm_config","page":"-","title":"MITgcmTools.MITgcm_config","text":"MITgcm_config()\n\nConcrete type of AbstractModelConfig for MITgcm which contains\n\n    model :: String = \"MITgcm\"\n    configuration :: String = \"\"\n    options :: OrderedDict{Any,Any} = OrderedDict{Any,Any}()\n    inputs :: OrderedDict{Any,Any} = OrderedDict{Any,Any}()\n    outputs :: OrderedDict{Any,Any} = OrderedDict{Any,Any}()\n    status :: OrderedDict{Any,Any} = OrderedDict{Any,Any}()\n    channel :: Channel{Any} = Channel{Any}(10) \n    folder :: String = tempdir()\n    ID :: UUID = UUIDs.uuid4()\n\nand with defaults that can be constructed as follows for example\n\nusing MITgcmTools\ntmp=MITgcm_config()\n\nexps=verification_experiments()\nexps[end]\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"type"},{"location":"functionalities_interface/#ClimateModels-Interface","page":"-","title":"ClimateModels Interface","text":"","category":"section"},{"location":"functionalities_interface/","page":"-","title":"-","text":"build\ncompile \nsetup\nMITgcm_launch\nclean","category":"page"},{"location":"functionalities_interface/#ClimateModels.build","page":"-","title":"ClimateModels.build","text":"build(config::MITgcm_config)\n\nBuild the model using genmake2, make depend, and make. The first two link all  code files, headers, etc  in the build/ folder before compiling the model\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\nbuild(config::MITgcm_config,options::String)\n\nBuild the model using genmake2, make depend, and make unless otherwise specified via options. The genmake2 and make depend commands link all  code files, headers, etc  in the build/ folder before make compiles the model.\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_interface/#ClimateModels.compile","page":"-","title":"ClimateModels.compile","text":"compile(config::MITgcm_config)\n\nCompile the model using make in build/ that has already been setup.\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_interface/#ClimateModels.setup","page":"-","title":"ClimateModels.setup","text":"setup(config::MITgcm_config)\n\nCreate a run/ folder and link everything there as needed to be ready to run model as  normally done for most-standard MITgcm configurations (incl. prepare_run and mitgcmuv). Call git_log_init(config) to setup git tracker and put!(config.channel,MITgcm_launch)  to be executed via launch(config) later.\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_interface/#MITgcmTools.MITgcm_launch","page":"-","title":"MITgcmTools.MITgcm_launch","text":"MITgcm_launch(config::MITgcm_config)\n\nGo to run/ folder and effectively call mitgcmuv > output.txt\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"function"},{"location":"functionalities_interface/#ClimateModels.clean","page":"-","title":"ClimateModels.clean","text":"clean(config::MITgcm_config)\n\nCancel any remaining task (config.channel) and clean up the run directory (via rm).\n\n(part of the climate model interface as specialized for MITgcm)\n\n\n\n\n\n","category":"function"},{"location":"examples/#Examples","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"Below are links to static html versions of the examples which one can open with a web browser.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"If instead you wanted to run the notebooks using Pluto.jl, then you might proceed as follows:","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"open julia in terminal window\ntype the commands shown below at the Julia prompt\nin web-browser, open one of the notebooks listed hereafter using the Pluto interface.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"cd(\"examples/\")\nusing Pluto\nPluto.run()","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"note: Note\nCompiling MITgcm requires a fortran compiler. This is a requirement for all notebooks except MITgcm_configurations.jl.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"MITgcm_configurations.jl ; explore MITgcm configurations and their parameters.\nMITgcm_run.jl : a detailed look into compiling and running the model.\nMITgcm_worklow.jl : build, setup, run, and plot for a chosen standard MITgcm configuration.\nHS94_animation.jl : run hs94.cs-32x32x5 configuration, read output, interpolate, and plot maps.\nHS94_particles.jl : compute particle trajectories from hs94.cs-32x32x5 output generated earlier.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"warning: Warning\nLinks for HS94_Makie.jl and MITgcm_scan_output.jl point to notebook files rather than generated html files as GLMakie.jl could not be compiled as needed for that process.","category":"page"},{"location":"examples/","page":"Examples","title":"Examples","text":"HS94_Makie.jl : using Makie.jl instead of Plots.jl\nMITgcm_scan_output.jl : scan output.txt, read grid, vizualize with Makie.jl ","category":"page"},{"location":"#MITgcmTools.jl","page":"Home","title":"MITgcmTools.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Tools for using MITgcm or analyzing its output. This includes compiling and running a model configuration, or inspecting model inputs and outputs. The ClimateModels.jl interface provides a standard framework for such workflows. ","category":"page"},{"location":"#Main-Features","page":"Home","title":"Main Features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Read Model Output And Files\nStandard MITgcm configurations\nClimate Model Interface\nExamples (notebooks in examples/)","category":"page"},{"location":"#main-contents","page":"Home","title":"Table Of Contents","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\n    \"functionalities.md\",\n    \"functionalities_read.md\",\n    \"functionalities_configurations.md\",\n    \"functionalities_interface.md\",\n    \"functionalities_more.md\",\n    \"examples.md\",\n]\nDepth = 2","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: Simulated particles from HS94 on cube sphere grid)","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: The impossible MITgcm rendering)","category":"page"}]
}
