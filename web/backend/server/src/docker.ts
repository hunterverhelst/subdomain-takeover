//import shell from 'shelljs'
import zonefile from 'dns-zonefile'
import fs from 'node:fs'


/*
 * These functions were originally created to use docker to dynamically create new irc servers when a new user account was created. I never tested to see if these worked, because I decided that it made more sense to not support this feature. It is outside the scope of the lesson and could cause students to use unnecessary resources on the host machine. 
 */
// const internal_net = 'docker_apache_test_internal-net'
// const external_net = 'docker_apache_test_outside'

// const createVolume = (accountName: string) => {
//     const createCommand = `docker volume create --name="${accountName.toLocaleLowerCase()}-data"`;
//     shell.exec(createCommand);
// }

// export const createErgoServer = (accountName: string) => {
//     // highly susceptible to command injection
//     createVolume(accountName);
//     const runCommand = `docker run -d -p 6698:6697 --name="${accountName.toLowerCase()} --network="${internal_net}"  --dns="192.168.0.53" -v ${accountName.toLocaleLowerCase()}-data:/ircd ghcr.io/ergochat/ergo:stable`;
//     const getIpCommand = `docker inspect -f "{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}" ${accountName.toLocaleLowerCase()}`
//     const connectCommand = `docker network connect ${external_net} ${accountName.toLowerCase()}`
//     shell.exec(runCommand)
//     shell.exec(connectCommand)
// }


// export const stopServer = (accountName: string) => {
//     const stopCommand = `docker stop ${accountName.toLocaleLowerCase()}`
//     shell.exec(stopCommand);
// }
// export const startServer = (accountName: string) => {
//     const startCommand = `docker start ${accountName.toLocaleLowerCase()}`
//     shell.exec(startCommand)
// }
// export const restartServer = (accountName: string) => {
//     stopServer(accountName);
//     startServer(accountName);

// }

const dbFile = '/root/dns/freeirc.db'

export const updateDNS = (oldSubdomain: string, newSubdomain: string) => {
    var date = new Date();
    var dateStr = date.toISOString().slice(0, 10).replace(/-/g, "") + date.getSeconds().toString();
    var dateNum = parseInt(dateStr)
    console.log(dateStr)
    const zoneStr = fs.readFileSync(dbFile).toString()
    let zoneJson = zonefile.parse(zoneStr)
    zoneJson.a.forEach(x => {
        if (x.name === oldSubdomain) {
            x.name = newSubdomain
        }
    })

    zoneJson.soa.serial = dateNum
    const newZoneStr = zonefile.generate(zoneJson);
    fs.writeFileSync(dbFile, newZoneStr)
}
