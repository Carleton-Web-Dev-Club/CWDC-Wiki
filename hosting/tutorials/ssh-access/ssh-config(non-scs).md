# SSH Proxy Jumps
As many of the servers are unavailable from the public internet, we need to determine a route to get from the internet to the host of your choice.

The path in this tutorial is: `your computer -> Carleton VPN -> CWDC Proxy gateway -> web-1`

If you are a member of the SCS, please instead follow the guide for [SCS students](./ssh-config(scs).md)
## Setting Up
### Downloading a VPN client
Follow ITS' guide on downloading and installing an OpenVPN client [here](https://carleton.ca/its/help-centre/remote-access/vpn-for-windows-10/)

### Finding a SSH Client
You need to ensure you have an openssh client. Linux and Mac systems should have one preinstalled, and windows users may have to follow [this guide to enable the feature](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse).

### Verifying an ssh client is installed
Lastly, you need to open up a terminal. Windows users should open up powershell.

Verify that typing `ssh` shows some text about usage.

## Connecting Manually
### Testing connection to the Carleton VPN
Log into the vpn. Verify you can access the following internal-only [OIRP page](https://oirp.carleton.ca/WDS/perspective.php). 
<!---TODO: Create internal site to accomplish same functionality---> 

### Connecting to CWDC Servers
Next, you can try to connect via the CWDC jump host. See the table under [network topology](../../README.md). In our case, we want to access web-1, To connect, run `ssh $cwdc-username@web-1 -J jump@cwdc.scs.carleton.ca`. Replace `$cwdc-username` with the username given to you by your CWDC admin.

That will do the following things:
 - Connect to the CWDC gateway. This does not need a password
 - Connect to the web-1 host using the username your CWDC admin gave you. You will need to put in the password that was also given by the admin.

 If successful, you should see a banner welcoming you to the CWDC openstack system. You may also be prompted for contact info if it is your first time logging in.

## OpenSSH Config
Remembering that command is a pain, but thankfully openssh provides a way to condense all of that into a much simpler command, a single config file.

### Creating ~/.ssh
First, run `ssh-keygen` as described [below](#creating-the-key). This is not the only way to do this step, but it does do some of the work you would have to do manually. 

### Finding ~/.ssh
On your host, go to your home folder, `~` on mac and linux, `%userprofile%` (C:\Users\foobar) on windows. You may have to change a setting to view hidden folders. If on windows, it is recommended that you change the setting to have it show file extensions as well.

You will see a folder named `.ssh`, open it. Create a file called `config`. Not `config.txt`, or anything else. Just a file named `config`.

### Adding the OpenSSH Config
Copy the contents of this file into it, replacing the variables as you did before. ([windows](https://cwdc.scs.carleton.ca/shared/ssh-config-windows.txt),[mac/linux](https://cwdc.scs.carleton.ca/shared/ssh-config-linux.txt)).
As you are not a SCS member, there are two places where you are asked to delete lines. Follow those instructions.

### Testing Config
To test, you can attempt to log into your assigned host. `cwdc-rp` represents the `reverse-proxy` host, `cwdc-db` represents the `db-host` host, and `cwdc-web-X` represents the `web-X` hosts. To log into `web-1`, all you have to do is run `ssh cwdc-web-1`. This should ask for your CWDC password given to by your admin. Enter this, and you should be logged in.

## Passwordless login with Public Keys
Instead of using password, you can use public key authentication, where you create a file, a private key, and a public key that is mathematically computed from the private key. After having a logged in user add your public key as a login option, you can use your private key to prove to the ssh server that you created the public key, and that you should be allowed to log in.  

### Creating the key
Run `ssh-keygen` on your host. Accepting the default values is good enough for everything. (Note that this can overwrite `~/.ssh/id_rsa`, which you *may* have set up for git or otherwise. If so, skip this step). It will ask you for a password. **This is different from the password used to login to the remote system.** This tutorial, and all others, will assume you left it blank. If you didn't, it will ask for a passphrase to unlock key at certain points. That will be the same password you enter here.

**The private key file created (`~/.ssh/id_rsa`) should never be shared with anyone. Sharing this file is akin to giving someone your password. The public key file (`~/.ssh/id_rsa.pub`) can be shared to anyone**

### Copying The Key
While there is a way to automate this using the `ssh-copy-id` program, it may not work as expected on windows systems, so you will do it the manual way.

In the terminal on your own host, run `Get-Content ~/.ssh/id_rsa.pub` on windows, or `cat ~/.ssh/id_rsa.pub` on anything else. Copy the output. To copy from terminal, you may need to select it, then right click, press ctrl+shift+c, or something else. It will look like this

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDlcH1DAAE/ccgsbFQchoBACdVXr8Yy8CLcb96EzdHVkMOtroQ97UCWI08WOCxxdYGBbsrDfAtF/2VIHA8oE1fJPRRbY8x51eN7x1vwfMBd2EHmTrtkVCDTvbdNGS/+hUzvt4Msplfl6XQz2EBCML8G3iBxHHwppVK2kvfMHieWfBmrw+e1pLUrYNZleuT0/gwjuf5jTpJ18rktohdDHGQoVPeyCaGDDU49O2VXimip6AnWtrk+6C3SFB2nMQwgRiWhP1RbrRAhYnYi6sFqvXujr1qy39rRPAQNoevQalbF2xGp2IfR7zJQxVxA8fRQYpXHPzvVpdokKVklQFigoLjPOF46xcwi7XddfjA4atpuLIgj21r6afdHWF9Px59tjpMpjLeQaPOViq1lO0RyHT3DzZNnwuHT2GB5utzmnvLXnH/4+8O0QuLPRjXEd0btzLycrIWM66nB7R9xJo4jZEhE6MbzI8WrOec2c6nrpkdXGD1TbH8BpJZYH7zdHAXOlD0= cbains@NullDev
```

### Adding the key to CWDC servers
Now you need to log into your designated CWDC server, from your own computer. Assuming you were given access to `web-1`, the command to run is `ssh cwdc-web-1`. You should only need to enter the password given to you by the cwdc openstack admin.

run the following commands:
```bash
mkdir ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
nano ~/.ssh/authorized_keys
```
Paste in the key you copied before. If it all pasted, Press ctrl+X, then Y. If not, press ctrl+X, then N, and rerun the `nano` command from above.

Afterwards, press ctrl+d to log out of the CWDC host, and get back to your computer's terminal.

### Testing passwordless login to CWDC servers
Try logging into your cwdc server. Run `ssh cwdc-web-1` on your own computer. You should be dropped right into the terminal on the CWDC host, no need to enter any passwords.



