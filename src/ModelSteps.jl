
module MITgcmScratchSpaces

using Downloads, Scratch

# This will be filled in inside `__init__()`
path = ""

# Downloads a resource, stores it within path
function download_dataset(url,path)
    fname = joinpath(path, basename(url))
    if !isfile(fname)
        Downloads.download(url, fname)
    end
    return fname
end

function __init__()
    global path = @get_scratch!("src")
end

end


"""
    testreport(config::MITgcm_config,ext="")

Run the testreport script for one model `config`,
with additional options (optional) speficied in `ext`

```
using MITgcm
testreport(MITgcm_config(configuration="front_relax"),"-norun")
#testreport(MITgcm_config(configuration="all"),"-norun")
```
"""
function testreport(config::MITgcm_config,ext="")
    nm=config.configuration
    try
        pth=pwd()
    catch e
        cd()
    end
    pth=pwd()
    cd(tempdir())
    println(pwd())
    if nm!=="all"
        lst=[nm]
    else
        exps=verification_experiments()
        lst=[exps[i].configuration for i in 1:length(exps)]
    end
    for nm in lst
        c=`$(MITgcm_path[1])/verification/testreport -t $(MITgcm_path[1])/verification/$(nm) $ext`
        isempty(ext) ? c=`$(MITgcm_path[1])/verification/testreport -t $(MITgcm_path[1])/verification/$(nm)` : nothing
        @suppress run(c)
    end
    cd(pth)
    return true
end

import ClimateModels: compile, build, setup, clean

"""
    clean(config::MITgcm_config)

Cancel any remaining task (config.channel) and clean up the run directory (via rm).

(part of the climate model interface as specialized for `MITgcm`)
"""
function clean(config::MITgcm_config)
    #cancel any remaining task
    while !isempty(config.channel)
        take!(config.channel)
    end
    #clean up run directory
    pp=joinpath(config.folder,string(config.ID),"run")
    isdir(pp) ? rm(pp,recursive=true) : nothing
    #
    return "no task left in pipeline"
end

"""
    build(config::MITgcm_config)

Build the model using `genmake2`, `make depend`, and `make`. The first two link all 
code files, headers, etc  in the `build/` folder before compiling the model

(part of the climate model interface as specialized for `MITgcm`)
"""
function build(config::MITgcm_config)
    nam=config.configuration
    try
        pth=pwd()
    catch e
        cd()
    end
    pth=pwd()

    if !haskey(config.inputs,:setup)||(config.inputs[:setup][:main][:category]=="verification")
        cd("$(MITgcm_path[1])/verification/$(nam)/build")
    else
        error("unknown configuration category")
    end

    try
        @suppress run(`../../../tools/genmake2 -mods=../code`) #$ext
        @suppress run(`make clean`)
        @suppress run(`make depend`)
        @suppress run(`make -j 4`)
    catch e
        println("model compilation may have failed")
    end
    cd(pth)
    return true
end

"""
    build(config::MITgcm_config,options::String)

Build the model using `genmake2`, `make depend`, and `make` unless otherwise
specified via `options`. The `genmake2` and `make depend` commands link all 
code files, headers, etc  in the `build/` folder before `make` compiles the model.

(part of the climate model interface as specialized for `MITgcm`)
"""
function build(config::MITgcm_config,options::String)
    nam=config.configuration
    if options=="--allow-skip"
        tst=!isfile(joinpath(MITgcm_path[1],"verification",nam,"build","mitgcmuv"))
        tst ? build(config) : nothing
    else
        build(config)
    end
    return true
end

"""
    compile(config::MITgcm_config)

Compile the model using `make` in `build/` that has already been setup.

(part of the climate model interface as specialized for `MITgcm`)
"""
function compile(config::MITgcm_config)
    nam=config.configuration
    try
        pth=pwd()
    catch e
        cd()
    end
    pth=pwd()
    cd("$(MITgcm_path[1])/verification/$(nam)/build")
    try
        @suppress run(`make -j 4`)
    catch e
        println("model compilation may have failed")
    end
    cd(pth)
    return true
end

"""
    setup(config::MITgcm_config)

Create a `run/` folder and link everything there as needed to be ready to run model as 
normally done for most-standard MITgcm configurations (incl. `prepare_run` and `mitgcmuv`).
Call `ClimateModels.git_log_init(config)` to setup git tracker and 
`put!(config.channel,MITgcm_launch)` to be executed via `launch(config)` later.

(part of the climate model interface as specialized for `MITgcm`)
"""
function setup(config::MITgcm_config)
    !isdir(joinpath(config.folder)) ? mkdir(joinpath(config.folder)) : nothing
    !isdir(joinpath(config.folder,string(config.ID))) ? mkdir(joinpath(config.folder,string(config.ID))) : nothing

    pth_run=joinpath(config.folder,string(config.ID),"run")
    !isdir(pth_run) ? mkdir(pth_run) : nothing

    pth_log=joinpath(config.folder,string(config.ID),"log","tracked_parameters")
    pth_mv=joinpath(config.folder,string(config.ID),"original_parameters")

    if !isfile(joinpath(pth_run,"data"))&&isfile(joinpath(pth_log,"data"))
        p=pth_log
        f=readdir(p)
        [symlink(joinpath(p,f[i]),joinpath(pth_run,f[i])) for i in 1:length(f)]
    end

    #here is where to generalize 

    if !haskey(config.inputs,:setup)||(config.inputs[:setup][:main][:category]=="verification")
        MITgcm_download()
        p="$(MITgcm_path[1])/verification/$(config.configuration)/input"
        tmpA=readdir(p)
        f=tmpA[findall([!isfile(joinpath(pth_run,tmpA[i])) for i in 1:length(tmpA)])]
        [symlink(joinpath(p,f[i]),joinpath(pth_run,f[i])) for i in 1:length(f)]

        #replace relative paths with absolutes then exe prepare_run
        if isfile(joinpath(pth_run,"prepare_run"))
            try
                pth=pwd()
            catch e
                cd()
            end
            pth=pwd()
            cd(pth_run)
            #
            fil="prepare_run"
            meta = read(fil,String)
            meta = split(meta,"\n")
            ii=findall(occursin.("../../",meta))
            for i in ii
                meta[i]=replace(meta[i],"../../" => "$(MITgcm_path[1])/verification/")
            end
            ii=findall(occursin.("../",meta))
            for i in ii
                meta[i]=replace(meta[i],"../" => "$(MITgcm_path[1])/verification/$(config.configuration)")
            end
            #rm old file from run dir
            rm(fil)
            #write new file in run dir
            txt=["$(meta[i])\n" for i in 1:length(meta)]
            fid = open(fil, "w")
            [write(fid,txt[i]) for i in 1:length(txt)]
            close(fid)
            #execute prepare_run
            chmod(fil,0o777)
            @suppress run(`./$(fil)`)
            #
            cd(pth)
        end

        if !islink(joinpath(pth_run,"mitgcmuv"))
            f="$(MITgcm_path[1])/verification/$(config.configuration)/build/mitgcmuv"
            symlink(f,joinpath(pth_run,"mitgcmuv")) 
        end

    else
        error("unknown configuration category")
    end

    logdir=joinpath(config.folder,string(config.ID),"log")
    !isdir(logdir) ? ClimateModels.git_log_init(config) : nothing

    #Replace namelists with editeable versions in log/
    #
    #- read from run folder, rewrite to log/parameter_files
    #- mv all namelists to ../original_parameter_files
    #- link from log/parameter_files to here (run/)
    #(- add to git with message = original params)

    if !isdir(pth_log)    
        mkdir(pth_log)
        params=read_all_namelists(pth_run)

        P=OrderedDict()
        P[:main]=OrderedDict(
            :category=>"verification",
            :name=>config.configuration,
            :version=>"main")
        push!(params,(:setup => P))

        write_all_namelists(params,pth_log)

        push!(config.inputs,params...)

        !isdir(pth_mv) ? mkdir(pth_mv) : nothing
        nmlfiles=list_namelist_files(pth_run)
        for fil in nmlfiles
            mv(joinpath(pth_run,fil),joinpath(pth_mv,fil))
            symlink(joinpath(pth_log,fil),joinpath(pth_run,fil))
        end

        ClimateModels.git_log_prm(config)
    end

    #add model run to scheduled tasks
    put!(config.channel,MITgcm_launch)

    return true
end

"""
    MITgcm_launch(config::MITgcm_config)

Go to `run/` folder and effectively call `mitgcmuv > output.txt`

(part of the climate model interface as specialized for `MITgcm`)
"""
function MITgcm_launch(config::MITgcm_config)
    try
        pth=pwd()
    catch e
        cd()
    end
    pth=pwd()
    cd(joinpath(config.folder,string(config.ID),"run"))
    tmp=["STOP NORMAL END"]
    try
        @suppress run(pipeline(`./mitgcmuv`,"output.txt"))
    catch e
        tmp[1]="model run may have failed"
    end
    cd(pth)
    return tmp[1]
end
