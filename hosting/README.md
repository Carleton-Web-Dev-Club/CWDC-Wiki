# CWDC Hosting

## About
The CWDC has obtained resources on Carleton University's Openstack Cluster. We can use these resources to host projects for CWDC members. We also have DNS records configured for [cwdc.scs.carleton.ca](https://cwdc.scs.carleton.ca), and use that domain to showcase our work on the broader internet


## Server Configuration
### Topology
Within openstack, we currently have 8 different VMs allocated. 
<table>
<tr>
    <th>hostname</th>
    <th>Public IP</th>
    <th>Private IP</th>
</tr>
<tr>
    <td>reverse-proxy</td>
    <td>134.117.26.94</td>
    <td>192.168.25.154</td>
</tr>
<tr>
    <td>db-host</td>
    <td>-</td>
    <td>192.168.25.65</td>
</tr>
<tr>
    <td>web-1</td>
    <td>-</td>
    <td>192.168.25.54</td>
</tr>
<tr>
    <td>web-2</td>
    <td>-</td>
    <td>192.168.25.149</td>
</tr>
<tr>
    <td>web-3</td>
    <td>-</td>
    <td>192.168.25.32</td>
</tr>
<tr>
    <td>web-4</td>
    <td>-</td>
    <td>192.168.25.117</td>
</tr>
<tr>
    <td>web-5</td>
    <td>-</td>
    <td>192.168.25.70</td>
</tr>


</table>
The entry point for the network is our proxy server (`reverse-proxy`). This terminates HTTP2 TLS connections from the broad internet, and passes them onto our other hosts. It also serves as a ssh jump server to allow connections to the other different VMs in the network.

We have one more special purpose vm, a database host (`db-host`). This runs a mongodb server, and also the club site API, as it is more latency sensitive than our other projects.

Finally, we have 6 general purpose hosts. (`web-1` to `web-6`)



### Networking

All computers in the network have access to the services on `db-host`, and every host allows TCP traffic at every port coming from the `reverse-proxy`.

All computers have an unfiltered egress connection.


### SSH Jump Host

SSH is not allowed from the broader internet into `reverse-proxy`, or any of the other hosts. To combat this, `reverse-proxy` allows ssh connections from anywhere within the Carleton network, and can be used to get to any of the other hosts. Details about how to connect can be found [here](example.com).
```
username:   jump
host:       cwdc.scs.carleton.ca
```

### Webhooks
All hosts come equiped with a [webhook server](https://github.com/adnanh/webhook), that can be used to execute scripts with github (or other) webhooks. The idea behind this being to limit the impact constant-running CD scripts for each project have on system resources, and to delegate that work to a single, efficient process.

This must be configured by the system admin, in the file `/etc/webhook.conf`. There were no good premade solutions for shared hosting solutions, so we use the webhook server with the following caveats.
 - The server executes the scripts as itself, and therefore must be run as a non privileged user to prevent a mal-intentioned CWDC user from privilege escalations. 
    - The server is run as user `daemon` and group `webhook`.
    - All scripts run therefore must have `o+rx` permissions (`chmod o+rx myscript`), or be owned by the webhook group (`chgrp webhook myscript`).
    - As the most common use for webhooks will be an autodeploy of sorts, the files it updates must also be owned by the group `webhook` (or publicly writable, but this is discouraged). You must `chgrp -R webhook [dir with files to be updates]`. You may need an admin for this.
- Secrets configured for webhooks can currently be seen by all users of the system

A webhook stub script can be downloaded from any of the hosts by running `sftp files@reverse-proxy:webhook.sh .`
