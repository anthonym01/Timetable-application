save: async function () {//Save the config file
    console.table('Configuration is being saved', config.data)

    ToStorageAPI();//save to application storage reguardless incase the file gets removed by the user, because users are kinda dumb
    if (config.baseconfig.use_alt_storage == true) {//save to alternate storage location
        ToFileSystem();
    }

    async function ToFileSystem() {//save config to directory defined by the user
        console.log('saving to File system: ', config.baseconfig.alt_location.toString())
        fs.open(config.baseconfig.alt_location.toString() + "/TT001_cfg config.json", mode:, (err, fd) => {
            console.log(fd)
            fs.writeFile(fd, JSON.stringify(config.data), 'utf8', (err) => {//write to file
                if (err) {//error
                    alert("An error occurred creating the file, please select a new location to save app data " + err.message)
                    config.selectlocation();
                } else {//sucessfull
                    console.log('config saved to: ', fd)
                }
                fs.close(fd);
            })
        })
        /*
        var file_descriptor = fs.open(config.baseconfig.alt_location.toString() + "/TT001_cfg config.json")

        await file_descriptor.then((file_descriptor)=>{
            fs.writeFile(file_descriptor, JSON.stringify(config.data), 'utf8', (err) => {//write to file
                if (err) {//error
                    alert("An error occurred creating the file, please select a new location to save app data " + err.message)
                    config.selectlocation();
                } else {//sucessfull
                    console.log('config saved to: ', file_descriptor)
                }
                fs.close(file_descriptor);
            })
        })*/

    }

    async function ToStorageAPI() {//Html5 storage API
        console.log('config saved to application storage')
        localStorage.setItem("TT001_cfg", JSON.stringify(config.data))
    }


},