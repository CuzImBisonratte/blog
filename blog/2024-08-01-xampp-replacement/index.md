---
slug: xampp-replacement
title: Replacing XAMPP under Ubuntu
authors: [konstantin]
tags: [xampp, nginx, php, sql, phpmyadmin, mysql, mariadb]
---

Hi,  
whilst sitting on a train, I thought about finally setting up an alternative to XAMPP as that really only works on Windows and I switched to Linux a few months ago.
<!-- truncate -->

## But why?

I wanted to have a local server running on my machine to test some things and I didn't want to use Docker for that.  
I also didn't want to use XAMPP as even though it is available for Linux, it is not really as easy to use and because my servers all run on Linux, I wanted to have a similar environment on my local machine.

So in this blog-tutorial-explanation-whatever I will tell you step-by-step what I did to set up a local server on my machine.

I use NGINX as my web server, because it is faster than Apache and I am used to it and therefore all my servers run NGINX. As a database I use MariaDB, because it is a easy to use software and again I already use it on my servers. For PHP I'll use PHP-FPM and for managing the Databases PHPMyAdmin.

## Install all software

To setup all needed software just run the following command:

```bash
sudo apt install nginx mariadb-server php-fpm php-mysql php-mbstring unzip
```

Whilst installing the version number of PHP chosen will be shown multiple times, write it down, as you'll need it later. If you didn't already see it whilst installing, you can also query the version by running `php -v` (Only the first two parts of the version number will be needed - like "8.3")

### Setup of NGINX

To setup multiple projects you could use differnt local hostnames, but I really like just using ports on localhost for different projects as it is one less step to setup.

For each of your projects create a file in the directory `/etc/nginx/sites-available/` and paste the following configuration file:
```yaml title="/etc/nginx/sites-available/projectname"
server {

        // highlight-start
        # Choose a port you like
        listen 8081;
        listen [::]:8081;
        // highlight-end

        server_name localhost;

        // highlight-start
        # Point to where the files you want to serve are
        root /var/www/projectName;
        // highlight-end
        index index.php index.html;

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;

                // highlight-start
                # Set the PHP-Version by replacing "8.3"
                fastcgi_pass unix:/run/php/php8.3-fpm.sock;
                // highlight-end
        }

        location / {
                try_files $uri $uri/ =404;
        }
}
```
After pasting set all values as you like where comments are (highlighted above).

Now you need to link the file to activate it (and reload nginx) by running:
```bash
sudo ln -s /etc/nginx/sites-available/projectName /etc/nginx/sites-enabled/
sudo systemctl reload nginx
``` 

:::note Why the weird linking system?
This _weird_ linking system makes it easy to deactivate a page when something goes wrong. The link to sites-enabled can just be deleted, whilst the original config file still stays the same. Therefore when the problem is solved, the link can just be re-applied and the configuration does not need to be rewritten.
:::

### Setup of PHP

We need to enable the mysql extension for PHP as it will be needed for PHPMyAdmin.

To do that you need to edit the PHP-Configuration-File (Don't forget to replace with your Version-Number!):
```sudo nano /etc/php/8.3/fpm/php.ini```

Now you need to find the line containing `extension=mysqli`. If you use nano for editing just press CTRL+w and enter `;extension=mysqli`.

Then you need to remove the comment char from the start (remove the Semicolon)

Do the same for the `mbstring`-extension too.

After that, you just need to reload PHP by running:
```bash
sudo systemctl reload php8.3-fpm
```

### Setup of MariaDB

:::info
The current versions of MariaDB sometimes have problems with authenticating the root user after installation. First, try the following steps normally, but if you have problems with the root user, you can find a solution here:
<details>
        <summary>Solution to fix `Access denied for user 'root'@'localhost'`</summary>

        If the root user can't authenticate, you can try to reset the root password by first forcing a MariaDB-Monitor (Like a SQL-Shell) to open by running:
        ```bash
        sudo mysql
        ```
        And then running the following SQL-Command:
        ```sql
        ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('');
        ```
        After that you can exit the MariaDB-Monitor by entering `exit` and then you can try to login with the root user again.
</details>
:::

MariaDB comes with a configuration assistant, that makes the first steps easier. To use it run the following command: 
```bash 
mysql_secure_installation
```
Now there will be many questions asked, the following are my recommended settings:

- You will be asked for the root password. Press Enter to continue (there is no password yet).
- You will be asked if you want to change authentication method. Enter **n** and press Enter to continue.
- You will be asked if you want to set a root password. Enter **n** and press Enter to continue.
- You will be asked if you want to remove anonymous users. Enter **y** and press Enter to continue.
- You will be asked if you want to disallow root login remotely. Enter **y** and press Enter to continue.
- You will be asked if you want to remove the test database and access to it. Enter **y** and press Enter to continue.
- You will be asked if you want to reload privilege tables now. Enter **y** and press Enter to continue.

Now I recommend setting a password for the root account, to do that you will need to open the MariaDB-Monitor (which is like a SQL Shell) by running 
```bash
mysql -u root
```
and in there you can run the following SQL-Command to set the root-user-Password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('<YOUR-PASSWORD>');
```
after that you exit the MariDB-Monitor by entering `exit`.  

:::warning
Even though remote root access is disabled it is a good idea to deny all access to the database server by denying the port in the firewall. If you are using UFW (Which is the default firewall for ubuntu), you can just run the following command:
```bash
sudo ufw deny 3306
sudo ufw enable
```
:::

### Setup of PHPMyAdmin

To install PHPMyAdmin you need to first download it by navigating to [phpmyadmin.net](https://www.phpmyadmin.net/) and then pressing the green download button in the top right corner. This will download PHPMyAdmin.

Now navigate to your Downloads and unzip it by running:
```bash
unzip FILENAME.zip
```

After it unzipped, you need to move to folder:
```bash
sudo mv FOLDER /var/www/phpmyadmin
```

After that you will need to set the owner of the PHPMyAdmin-Directory to the nginx user so PHPMyAdmin can write there. You can do that by running:
```bash
sudo chown www-data:www-data -R /var/www/phpmyadmin
```

Now you will just need to create a NGINX-configuration file for PHPMyAdmin as in the Section [Setup of NGINX](#setup-of-nginx):

```yaml title="/etc/nginx/sites-available/phpmyadmin"
server {
        listen 3333;
        listen [::]:3333;

        server_name localhost;

        root /var/www/phpmyadmin;
        index index.html index.php;

        location ~ \.php$ {
               include snippets/fastcgi-php.conf;
               fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        }

        location / {
                try_files $uri $uri/ =404;
        }
}
```
:::warning
Do not forget to set the PHP-Version and (if wanted) another Port AND to link the file to sites-enabled and reload NGINX as in the Section [Setup of NGINX](#setup-of-nginx)

If you don't want PHPMyAdmin to be accessible from other devices I strongly recommend denying it in your firewall by running:
```bash
sudo ufw deny 3333
sudo ufw reload
sudo ufw enable
```
:::

## That's it

Now everything is set up to work, just restart all services by just following the rest of the tutorial or by running the following commands:

```bash
sudo systemctl reload nginx
sudo systemctl reload php8.3-fpm
sudo systemctl restart mariadb
```

## Further setup

For easier development (and full functionality) I still recommend taking some quick steps:

### Shortcut-Commands
As you may use your device not only for development you may want to be able to turn on or off all services quickly.

For that you need to first disable them starting at system startup:
```bash
sudo systemctl disable nginx
sudo systemctl disable mariadb
sudo systemctl disable php8.3-fpm
```

And then you can add a bash shortcut to make it easy to stop and start these services. You do that by appending the following to the .bash_aliases file (e.g. using `nano ~/.bash_aliases`):
```bash title="~/.bash_aliases"
# Development services
alias devon="sudo systemctl start php8.3-fpm && sudo systemctl start nginx && sudo systemctl start mariadb"
alias devoff="sudo systemctl stop php8.3-fpm && sudo systemctl stop nginx && sudo systemctl stop mariadb"
```
After re-opening the terminal (or running `source ~/.bash_aliases`), you can use the commands `devon` and `devoff` to turn on or off your services easily.

### Finish PHPMyAdmin Setup

All of the following changes will need you to change something in the PHPMyAdmin configuration found under `/var/www/phpmyadmin/config.inc.php`. This _tutorial_ will not contain every step but just which variable to fill to shorten it a bit.

First you will need to copy the sample configuration file to the actual configuration file by running:
```bash
sudo cp /var/www/phpmyadmin/config.sample.inc.php /var/www/phpmyadmin/config.inc.php
```

From now on you can edit the configuration file by running:
```bash
sudo nano /var/www/phpmyadmin/config.inc.php
```

#### Blowfish-Secret
The blowfish secret is a key used for encryption of the session cookies. You should set it in the configuration.

1. Generate a 32-bit secret by running 
```bash
php -r 'echo bin2hex(random_bytes(32)) . PHP_EOL;'
```
2. Set the config variable `$cfg['blowfish_secret']` in the following format:
```
$cfg['blowfish_secret'] = sodium_hex2bin('f16ce59f45714194371b48fe362072dc3b019da7861558cd4ad29e4d6fb13851');
```

#### Configuration Storage
Setting up configuration storage is a little bit more complicated.

You will need access to the sql directory within the phpmyadmin directory, so i recommend copying it to a user-accessible folder: ```sudo cp -r /var/www/phpmyadmin/sql ~/```

After that open the MariaDB-Monitor by running ```mysql -u root -p``` and entering the password set at [Setup of MariaDB](#setup-of-mariadb).

Then run the following command to create a new user called `pma` which is the control user for PHPMyAdmin (replace the `###PASSWORD###` with a new password for the control user):
```sql
CREATE USER 'pma'@'localhost' IDENTIFIED VIA mysql_native_password USING PASSWORD('###PASSWORD###');GRANT ALL PRIVILEGES ON *.* TO 'pma'@'localhost' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0; 
```

Then you will need to add the highlighted lines to the config:
```php title="/var/www/phpmyadmin/config.inc.php"
$i++;
/* Authentication type */
$cfg['Servers'][$i]['auth_type'] = 'cookie';
/* Server parameters */
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = false;
// highlight-start
$cfg['Servers'][$i]['controluser'] = 'pma';
$cfg['Servers'][$i]['controlpass'] = '###PASSWORD###';
// highlight-end
```

To finish the setup you will need to import the tables for the configuration storage by running the following command:
```bash
mysql -u root -p < ~/sql/create_tables.sql
```
It will ask for the password of the root user and then import the tables.

That's it, you now have a fully working PHPMyAdmin setup.

#### Theming PHPMyAdmin
As I really like dark themes I always change the theme of PHPMyAdmin to a dark one. You can download themes from the [PHPMyAdmin-Theme-Repository](https://www.phpmyadmin.net/themes/) and then just extract them to the `/var/www/phpmyadmin/themes` directory.

## Conclusion

That's it, you now have a fully working local server setup on your machine. I hope this tutorial was helpful and you can now easily develop your projects locally.

Thanks for reading :)