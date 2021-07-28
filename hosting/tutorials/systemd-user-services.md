# Systemd Unit Services
When in development, there is no real need to keep your web server running for extended amounts of time. In a server environment, you want your scripts to have a robust method to auto start on boot, and restart on failure.

This tutorial assumes you can:
 - ssh into your cwdc host
 - Navigate around the directory structure in linux (cd, ls) 
 - Use a terminal text editor
 - Run your service on the cwdc host

This tutorial will guide you through setting up a systemd user service, to ensure your script auto starts

## Gathering info
Start off by running your service manually. This will obviously depend on what technologies you've build it on. Assuming it is a simple express server, you might need to 

```bash
cd ~/my-server
npm run serve
```
Afterwards, kill your service, and run `pwd`. Record this. This is the current working directory.


## Creating the service file
There is a small utility to verify your input as you create the service. run `run-cwdc-script shared/scripts/service-manager` on your cwdc host. 

Give your service a name, it must be alphanumeric, and can contain any of these symbols. "._-"

Enter the output of the `pwd` command when it asks for the working directory.

Next, enter a description of the service. You can leave this blank if you want

Next, enter the command you used to start the service. In our example, this was `npm run serve`. It will likely prompt you to accept changes, saying it fixed the command to be `/usr/bin/npm run serve`. You can open another terminal and log into the cwdc host, navigate to the right directory, and try the command it suggests. If it works, accept the changes, if not, you can try and proceed without the changes.

## Using the service file
With your script not running manually anywhere, you can now try the following commands
- (recommended) Autostart on server boot `systemctl --user enable [your-service-name-here]
`
- (recommended) Start now `systemctl --user start [your-service-name-here]
`
- Restart the service `systemctl --user restart [your-service-name-here]
`
- Stop the service `systemctl --user stop [your-service-name-here]
`
- Don't autostart on server boot `systemctl --user disable [your-service-name-here]
`
- View logs printed by service `journalctl --user -xefu [your-service-name-here]

## Going further
A real production setup may have a more complicated environment than simply running a single command to start, and then killing the process to stop. Systemd services have ways to customize health checks, run commands to shutdown the service, load specific environmental variables, and much more. The service file created by this tool is written to `~/.config/systemd/services/[your-service-name-here].service`. You can edit this, following the manual which you can read by running `man systemd.service`


