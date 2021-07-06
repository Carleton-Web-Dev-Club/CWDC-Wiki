# SSH Proxy Jumps
As many of the servers are unavailable from the public internet, we need to determine a route to get from the internet to the host of your choice.

The path in this tutorial is: `your computer -> SCS access gateway -> CWDC Proxy gateway -> web-1`

## Setting Up
First, we need all the relevant accounts. Use the [SCS account creation tool](https://newacct.scs.carleton.ca/scs_authentication/newacct-policy-form.php) to get started.

Second, we need to ensure we have an openssh client. Linux and Mac systems should have one preinstalled, and windows users may have to follow [this guide to enable the feature](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse).

Third, we need to open up a terminal. Windows users should open up powershell (you may need to run it as an admin).

Verify that typing `ssh` shows some text about usage.

## Connecting Manually
First, try to connect to the SCS access gateway. This is our way into the carleton network. Run `ssh $mc1username@scs.access.carleton.ca`, replacing `$mc1username` with your mc1 username. The password will be either your mc1 one, or whatever you set while creating your scs account.

Next, we can try to connect via the CWDC jump host. See the table under [network topology](../../README.md). In our case, we want to access web-1, which has a private IP of `192.168.25.54`. To connect, run `ssh $cwdc-username@192.168.25.54 -J jump@cwdc.scs.carleton.ca,$mc1username@access.scs.carleton.ca`. Again, replace `$mc1username` with your mc1 username, and replace `$cwdc-username` with the username given to you by your CWDC admin.

That will do the following things:
 - Connect to the SCS Access gateway. (You must put your password you found in the first step, in here)
 - Connect from the SCS Access gateway to the CWDC gateway. This does not need a password
 - Connect to the web-1 host using the username your CWDC admin gave you. You will need to put in the password that was also given by the admin.

 If successful, you should see a banner welcoming you to the CWDC openstack system. You may also be prompted for contact info if it is your first time logging in.

## OpenSSH Config

Remembering that command is a pain, but thankfully openssh provides a way to condense all of that into a much simpler command. 

First, run `ssh-keygen` as described below. This is not strictly required for this step, but it does do some of the work we would have to do manually. 

Go to your home folder, `~` on mac and linux, `%userprofile%` on windows. You may have to change a setting to view hidden folders. If on windows, it is recommended that you change the setting to have it show file extensions as well.

You will see a folder name `.ssh`, open it. Create a file called `config`. Not `config.txt`, or anything else. Just a file named config. Copy the contents of this file into it, replacing the variables as we did before. ([windows](https://cwdc.scs.carleton.ca/shared/ssh-config-windows.txt),[mac/linux](https://cwdc.scs.carleton.ca/shared/ssh-config-linux.txt)).

To test, you can attempt to log into your assigned host. `cwdc-rp` represents the `reverse-proxy` host, `cwdc-db` represents the `db-host` host, and `cwdc-web-X` represents the `web-X` hosts. To log into `web-1`, all you have to do is run `ssh cwdc-web-1`. This should ask you first for your scs unix account password, then your CWDC password given to by your admin. Enter these, and you should be logged in.

## Passwordless login with Public Keys
Instead of using password, we can use public key authentication, where we create a file, a private key, and a public key that is mathematically computed from the private key. After having a logged in user add our public key as a login option, we can use our private key to prove to the ssh server that we created the public key, and that we should be allowed to log in.  

Run `ssh-keygen`. Accepting the default values is good enough for everything. (Note that this can overwrite `~/.ssh/id_rsa`, which you *may* have set up for git or otherwise. If so, skip this step). It will ask you for a password. **This is different from the password used to login to the remote system.**. This tutorial, and all others, will assume you left it blank. If you didn't, it will ask for a passphrase to unlock key at certain points. That will be the same password you enter here.

//Todo: write about ssh-copy-id, and see if it works using the openssh config

