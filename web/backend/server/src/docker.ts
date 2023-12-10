import zonefile from 'dns-zonefile'
import fs from 'node:fs'

const dbFile = '/root/dns/freeirc.db'

export const updateDNS = (oldSubdomain: string, newSubdomain: string): boolean => {
    // create a date string to use as the serial field in the SOA record
    // serial must be updated or else coredns won't reload the file
    var date = new Date();
    var dateStr = date.toISOString().slice(0, 10).replace(/-/g, "") + date.getSeconds().toString();
    var dateNum = parseInt(dateStr)

    // read the dns zone file
    const zoneStr = fs.readFileSync(dbFile).toString()

    // convert it to a json object using zonefile
    let zoneJson = zonefile.parse(zoneStr)

    // check to make sure subdomain isn't taken
    if (zoneJson.a.find(x => x.name === newSubdomain) !== undefined) {
        return false;
    }

    // find current DNS record
    let oldRecord = zoneJson.a.find(x => x.name == oldSubdomain)
    if (oldRecord === undefined) {
        return false;
    }
    // change the A record to the new name
    oldRecord.name = newSubdomain

    // update teh serial field
    zoneJson.soa.serial = dateNum
    // reconvert data back to zonefile format
    const newZoneStr = zonefile.generate(zoneJson);
    // write to file
    fs.writeFileSync(dbFile, newZoneStr)
    return true;
}
