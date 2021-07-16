# Git Deploy Keys
The majority of projects run by the CWDC will likely be backed by a git repository, likely on github.

While providing git your login info for github isn't overtly insecure, it does put your account at risk if the servers are breached. To minimize this risk, it is recommended to use deploy keys. These can act as read only, or read/write keys for repositories your explicitly specify.

## Generating a key
Log into your CWDC host, and run `ssh-keygen -f ~/.ssh/deploy_key -N ""`. Listing files with `ls -l ~/.ssh`, you should see  `deploy_key`, and `deploy_key.pub` files.

Run `cat ~/.ssh/deploy_key.pub`, and copy the output. It should look something like this.
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDlcH1DAAE/ccgsbFQchoBACdVXr8Yy8CLcb96EzdHVkMOtroQ97UCWI08WOCxxdYGBbsrDfAtF/2VIHA8oE1fJPRRbY8x51eN7x1vwfMBd2EHmTrtkVCDTvbdNGS/+hUzvt4Msplfl6XQz2EBCML8G3iBxHHwppVK2kvfMHieWfBmrw+e1pLUrYNZleuT0/gwjuf5jTpJ18rktohdDHGQoVPeyCaGDDU49O2VXimip6AnWtrk+6C3SFB2nMQwgRiWhP1RbrRAhYnYi6sFqvXujr1qy39rRPAQNoevQalbF2xGp2IfR7zJQxVxA8fRQYpXHPzvVpdokKVklQFigoLjPOF46xcwi7XddfjA4atpuLIgj21r6afdHWF9Px59tjpMpjLeQaPOViq1lO0RyHT3DzZNnwuHT2GB5utzmnvLXnH/4+8O0QuLPRjXEd0btzLycrIWM66nB7R9xJo4jZEhE6MbzI8WrOec2c6nrpkdXGD1TbH8BpJZYH7zdHAXOlD0= cbains@NullDev
```

## Configuring git to use your key
Running `git config --global core.sshCommand "ssh -i ~/.ssh/deploy_key"` will force all reads/writes of private repos, and all writes of public repos, to use the deploy key.

Clear this configuration with `git config --global core.sshCommand "ssh"`

## Adding Key to github
- Find your repository on github
- Go to its settings
- Go to the "deploy keys" section
- Click "Add Deploy Key"
- The title can be anything
- Paste the public key you copied earlier, in the Key section
- Decide if you want to be able to push from the CWDC host. More often than not, you don't need to, and can leave the "Allow Write Access" box unchecked

## Using the deploy key
Your checkout needs to use SSH to communicate with github, in order for deploy keys to work.

### If you have an existing repository cloned
Run `git remote get-url origin` in your existing checkout. If it doesn't start with "git@github.com"*, then go to the github page for your repository. Under the download code dropdown on github, pick SSH. Copy that address. Then run `git remote set-url origin [clopied ssh clone url]`. Run `git fetch` to verify all is working.

\*If it does start with "git@github.com", everything is already setup the correct way.

### If you have yet to clone the repository
Under the download code dropdown on github, you can pick https, ssh or github cli. Pick SSH. Run `git clone [copied ssh clone url]` to clone the repository into your current directory