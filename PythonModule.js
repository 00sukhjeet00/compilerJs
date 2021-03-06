const fs = require('fs')
const exec = require('child_process').exec
const cuid = require('cuid')
const CompilePyModule = (envData, code, cb) => {
    if (envData.ext !== 'py')
        console.log(`[x]INFO: Provide py ext.`)
    else {
        const fileName = cuid.slug()
        const path = './code/'
        fs.writeFile(`${path}${fileName}.py`, code, (err) => {
            if (err)
                console.log(`[x]ERROR: ${err}`)
            else {
                var programNotFinished = true
                console.log(`[+]INFO: ${fileName}.py is created`)
                const command = `python ${path}${fileName}.py`
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`[+]ERROR: ${fileName}.py contained error while compiling`)
                        const out = { error: stderr }
                        cb(out)
                    }
                    else {
                        if (programNotFinished) {
                            programNotFinished = false
                            console.log(`[+]INFO: ${fileName}.py successfully executed`)
                            cb({ out: stdout })
                        }
                    }
                })
                if (envData.options.timeout) {
                    setTimeout(() => {
                        if (programNotFinished) {
                            programNotFinished = false
                            console.log(`[+]INFO: ${fileName}.py has been terminated`)
                            var out = { timeout: true }
                            cb(out)
                        }
                    }, envData.options.timeout)
                }
            }

        })
    }
}
const CompilePyModuleWithInput = (envData, code, input, cb) => {
    if (envData.ext !== 'py')
        console.log(`[x]INFO: Provide py ext.`)
    else {
        const fileName = cuid.slug()
        const path = './code/'
        fs.writeFile(`${path}${fileName}.py`, code, (err) => {
            if (err)
                console.log(`[x]INFO: ${err}`)
            else {
                if (!input)
                    console.log('[x]INFO: Input is not provided')
                else {
                    fs.writeFile(`${path}${fileName}input.txt`, input, (err) => {
                        if (err)
                            console(`[x]ERROR: ${err}`)
                        else {
                            var programNotFinished = true
                            const command = `python ${path}${fileName}.py < ${path}${fileName}input.txt`
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    console.log(`[x]ERROR: Error while executing ${fileName}.py`)
                                    const out = { error: stderr }
                                    cb(out)
                                }
                                else {
                                    if (programNotFinished) {
                                        programNotFinished = false
                                        console.log(`[+]INFO: ${fileName}.py executed successfully`)
                                        cb({ out: stdout })
                                    }
                                }
                            })
                            if (envData.options.timeout) {
                                setTimeout(() => {
                                    if (programNotFinished) {
                                        programNotFinished = false
                                        console.log(`[+]INFO: ${fileName}.py has been terminated`)
                                        var out = { timeout: true }
                                        cb(out)
                                    }
                                }, envData.options.timeout)
                            }
                        }
                    })
                }
            }
        })
    }
}
module.exports = { CompilePyModule, CompilePyModuleWithInput }