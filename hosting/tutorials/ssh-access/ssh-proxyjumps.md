# SSH Proxy Jumps
As many of the servers are unavailable from the public internet, we need to determine a route to get from the internet to the host of your choice.

The path in this tutorial is: `your computer -> SCS access gateway -> CWDC Proxy gateway -> web-1`

## Setting Up
### Creating Accounts
First, we need all the relevant accounts. Use the [SCS account creation tool](https://newacct.scs.carleton.ca/scs_authentication/newacct-policy-form.php) to get started.

### Finding a SSH Client
Second, we need to ensure we have an openssh client. Linux and Mac systems should have one preinstalled, and windows users may have to follow [this guide to enable the feature](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse).

### Verifying an ssh client is installed
Third, we need to open up a terminal. Windows users should open up powershell.

Verify that typing `ssh` shows some text about usage.

## Connecting Manually
### Testing connection to the SCS Access Gateway
First, try to connect to the SCS access gateway. This is our way into the carleton network. Run `ssh $mc1username@scs.access.carleton.ca`, replacing `$mc1username` with your mc1 username. The password will be either your mc1 one, or whatever you set while creating your scs account.

### Connecting to CWDC Servers
Next, we can try to connect via the CWDC jump host. See the table under [network topology](../../README.md). In our case, we want to access web-1, which has a private IP of `192.168.25.54`. To connect, run `ssh $cwdc-username@192.168.25.54 -J jump@cwdc.scs.carleton.ca,$mc1username@access.scs.carleton.ca`. Again, replace `$mc1username` with your mc1 username, and replace `$cwdc-username` with the username given to you by your CWDC admin.

That will do the following things:
 - Connect to the SCS Access gateway. (You must put your password you found in the first step, in here)
 - Connect from the SCS Access gateway to the CWDC gateway. This does not need a password
 - Connect to the web-1 host using the username your CWDC admin gave you. You will need to put in the password that was also given by the admin.

 If successful, you should see a banner welcoming you to the CWDC openstack system. You may also be prompted for contact info if it is your first time logging in.

## OpenSSH Config
Remembering that command is a pain, but thankfully openssh provides a way to condense all of that into a much simpler command, a single config file.

### Creating ~/.ssh
First, run `ssh-keygen` as described [below](#creating-the-key). This is not strictly required for this step, but it does do some of the work we would have to do manually. 

### Finding ~/.ssh
Go to your home folder, `~` on mac and linux, `%userprofile%` on windows. You may have to change a setting to view hidden folders. If on windows, it is recommended that you change the setting to have it show file extensions as well.

You will see a folder name `.ssh`, open it. Create a file called `config`. Not `config.txt`, or anything else. Just a file named config. 
### Adding the OpenSSH Config
Copy the contents of this file into it, replacing the variables as we did before. ([windows](https://cwdc.scs.carleton.ca/shared/ssh-config-windows.txt),[mac/linux](https://cwdc.scs.carleton.ca/shared/ssh-config-linux.txt)).

### Testing Config
To test, you can attempt to log into your assigned host. `cwdc-rp` represents the `reverse-proxy` host, `cwdc-db` represents the `db-host` host, and `cwdc-web-X` represents the `web-X` hosts. To log into `web-1`, all you have to do is run `ssh cwdc-web-1`. This should ask you first for your scs unix account password, then your CWDC password given to by your admin. Enter these, and you should be logged in.

## Passwordless login with Public Keys
Instead of using password, we can use public key authentication, where we create a file, a private key, and a public key that is mathematically computed from the private key. After having a logged in user add our public key as a login option, we can use our private key to prove to the ssh server that we created the public key, and that we should be allowed to log in.  

### Creating the key
Run `ssh-keygen`. Accepting the default values is good enough for everything. (Note that this can overwrite `~/.ssh/id_rsa`, which you *may* have set up for git or otherwise. If so, skip this step). It will ask you for a password. **This is different from the password used to login to the remote system.**. This tutorial, and all others, will assume you left it blank. If you didn't, it will ask for a passphrase to unlock key at certain points. That will be the same password you enter here.

### Copying The Key
While there is a way to automate this using the `ssh-copy-id` program, it may not work as expected on windows systems, so we will do it the manual way.

In the terminal on your own system, run `Get-Content ~/.ssh/id_rsa.pub` on windows, or `cat ~/.ssh/id_rsa.pub` on anything else. Copy the output. To copy from terminal, you may need to select it, then right click, press ctrl+shift+c, or something else. It will look like this
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDlcH1DAAE/ccgsbFQchoBACdVXr8Yy8CLcb96EzdHVkMOtroQ97UCWI08WOCxxdYGBbsrDfAtF/2VIHA8oE1fJPRRbY8x51eN7x1vwfMBd2EHmTrtkVCDTvbdNGS/+hUzvt4Msplfl6XQz2EBCML8G3iBxHHwppVK2kvfMHieWfBmrw+e1pLUrYNZleuT0/gwjuf5jTpJ18rktohdDHGQoVPeyCaGDDU49O2VXimip6AnWtrk+6C3SFB2nMQwgRiWhP1RbrRAhYnYi6sFqvXujr1qy39rRPAQNoevQalbF2xGp2IfR7zJQxVxA8fRQYpXHPzvVpdokKVklQFigoLjPOF46xcwi7XddfjA4atpuLIgj21r6afdHWF9Px59tjpMpjLeQaPOViq1lO0RyHT3DzZNnwuHT2GB5utzmnvLXnH/4+8O0QuLPRjXEd0btzLycrIWM66nB7R9xJo4jZEhE6MbzI8WrOec2c6nrpkdXGD1TbH8BpJZYH7zdHAXOlD0= cbains@NullDev
```
### Adding the key to the SCS Access Gateway
Afterwards, log into the SCS access host with `ssh scs-access`. In that terminal, run the following commands:
```bash
mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
nano ~/.ssh/authorized_keys
```
Paste in the key you copied before. If it all pasted, Press ctrl+X, then Y. If not, press ctrl+X, then N, and rerun the `nano` command from above.

Afterwards, press ctrl+d to log out of the SCS Access host, and get back to your computer's terminal.

### Testing passwordless login to the SCS Access Gateway
On your own computer, run `ssh scs-access`. Now that we have the public key added, if should no longer ask for a password. Press ctrl+d, or type logout and hit enter, to logout

### Adding the key to CWDC servers
Now we need to log into our designated CWDC server. Assuming we were given access to `web-1`, the command is `ssh cwdc-web-1`. You should only need to enter the password given to you by the cwdc openstack admin.

Repeat the 4 commands in the [above](#adding-the-key-to-the-scs-access-gateway). Again, save and exit. Then logout of the server.

### Testing passwordless login to CWDC servers
Try logging into your cwdc server. `ssh cwdc-web-1`. You should be dropped right into the terminal, no need to enter any passwords.



