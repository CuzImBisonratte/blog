"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[518],{4369:e=>{e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"xampp-replacement","metadata":{"permalink":"/xampp-replacement","source":"@site/blog/2024-08-01-xampp-replacement/index.md","title":"Replacing XAMPP under Ubuntu","description":"Hi,","date":"2024-08-01T00:00:00.000Z","tags":[{"inline":false,"label":"XAMPP","permalink":"/tags/xampp","description":"A web server solution package"},{"inline":false,"label":"Nginx","permalink":"/tags/nginx","description":"A web server like Apache"},{"inline":false,"label":"PHP","permalink":"/tags/php","description":"Server-Side Scripting Language"},{"inline":false,"label":"SQL","permalink":"/tags/sql","description":"Query Language for Databases"},{"inline":false,"label":"phpMyAdmin","permalink":"/tags/pma"},{"inline":false,"label":"MySQL","permalink":"/tags/mysql"},{"inline":false,"label":"MariaDB","permalink":"/tags/maria-db","description":"Replacement for a MySQL-Server"}],"readingTime":9.16,"hasTruncateMarker":true,"authors":[{"name":"Konstantin Protzen","title":"Hobby-Fullstack-Dev","url":"https://github.com/cuzimbisonratte","imageURL":"https://github.com/cuzimbisonratte.png","key":"konstantin"}],"frontMatter":{"slug":"xampp-replacement","title":"Replacing XAMPP under Ubuntu","authors":["konstantin"],"tags":["xampp","nginx","php","sql","phpmyadmin","mysql","mariadb"]},"unlisted":false,"nextItem":{"title":"Welcome","permalink":"/welcome"}},"content":"Hi,  \\nwhilst sitting on a train, I thought about finally setting up an alternative to XAMPP as that really only works on Windows and I switched to Linux a few months ago.\\n\x3c!-- truncate --\x3e\\n\\n## But why?\\n\\nI wanted to have a local server running on my machine to test some things and I didn\'t want to use Docker for that.  \\nI also didn\'t want to use XAMPP as even though it is available for Linux, it is not really as easy to use and because my servers all run on Linux, I wanted to have a similar environment on my local machine.\\n\\nSo in this blog-tutorial-explanation-whatever I will tell you step-by-step what I did to set up a local server on my machine.\\n\\nI use NGINX as my web server, because it is faster than Apache and I am used to it and therefore all my servers run NGINX. As a database I use MariaDB, because it is a easy to use software and again I already use it on my servers. For PHP I\'ll use PHP-FPM and for managing the Databases PHPMyAdmin.\\n\\n## Install all software\\n\\nTo setup all needed software just run the following command:\\n\\n```bash\\nsudo apt install nginx mariadb-server php-fpm php-mysql php-mbstring unzip\\n```\\n\\nWhilst installing the version number of PHP chosen will be shown multiple times, write it down, as you\'ll need it later. If you didn\'t already see it whilst installing, you can also query the version by running `php -v` (Only the first two parts of the version number will be needed - like \\"8.3\\")\\n\\n### Setup of NGINX\\n\\nTo setup multiple projects you could use differnt local hostnames, but I really like just using ports on localhost for different projects as it is one less step to setup.\\n\\nFor each of your projects create a file in the directory `/etc/nginx/sites-available/` and paste the following configuration file:\\n```yaml title=\\"/etc/nginx/sites-available/projectname\\"\\nserver {\\n\\n        // highlight-start\\n        # Choose a port you like\\n        listen 8081;\\n        listen [::]:8081;\\n        // highlight-end\\n\\n        server_name localhost;\\n\\n        // highlight-start\\n        # Point to where the files you want to serve are\\n        root /var/www/projectName;\\n        // highlight-end\\n        index index.php index.html;\\n\\n        location ~ \\\\.php$ {\\n                include snippets/fastcgi-php.conf;\\n\\n                // highlight-start\\n                # Set the PHP-Version by replacing \\"8.3\\"\\n                fastcgi_pass unix:/run/php/php8.3-fpm.sock;\\n                // highlight-end\\n        }\\n\\n        location / {\\n                try_files $uri $uri/ =404;\\n        }\\n}\\n```\\nAfter pasting set all values as you like where comments are (highlighted above).\\n\\nNow you need to link the file to activate it (and reload nginx) by running:\\n```bash\\nsudo ln -s /etc/nginx/sites-available/projectName /etc/nginx/sites-enabled/\\nsudo systemctl reload nginx\\n``` \\n\\n:::note Why the weird linking system?\\nThis _weird_ linking system makes it easy to deactivate a page when something goes wrong. The link to sites-enabled can just be deleted, whilst the original config file still stays the same. Therefore when the problem is solved, the link can just be re-applied and the configuration does not need to be rewritten.\\n:::\\n\\n### Setup of PHP\\n\\nWe need to enable the mysql extension for PHP as it will be needed for PHPMyAdmin.\\n\\nTo do that you need to edit the PHP-Configuration-File (Don\'t forget to replace with your Version-Number!):\\n```sudo nano /etc/php/8.3/fpm/php.ini```\\n\\nNow you need to find the line containing `extension=mysqli`. If you use nano for editing just press CTRL+w and enter `;extension=mysqli`.\\n\\nThen you need to remove the comment char from the start (remove the Semicolon)\\n\\nDo the same for the `mbstring`-extension too.\\n\\nAfter that, you just need to reload PHP by running:\\n```bash\\nsudo systemctl reload php8.3-fpm\\n```\\n\\n### Setup of MariaDB\\n\\n:::info\\nThe current versions of MariaDB sometimes have problems with authenticating the root user after installation. First, try the following steps normally, but if you have problems with the root user, you can find a solution here:\\n<details>\\n        <summary>Solution to fix `Access denied for user \'root\'@\'localhost\'`</summary>\\n\\n        If the root user can\'t authenticate, you can try to reset the root password by first forcing a MariaDB-Monitor (Like a SQL-Shell) to open by running:\\n        ```bash\\n        sudo mysql\\n        ```\\n        And then running the following SQL-Command:\\n        ```sql\\n        ALTER USER \'root\'@\'localhost\' IDENTIFIED VIA mysql_native_password USING PASSWORD(\'\');\\n        ```\\n        After that you can exit the MariaDB-Monitor by entering `exit` and then you can try to login with the root user again.\\n</details>\\n:::\\n\\nMariaDB comes with a configuration assistant, that makes the first steps easier. To use it run the following command: \\n```bash \\nmysql_secure_installation\\n```\\nNow there will be many questions asked, the following are my recommended settings:\\n\\n- You will be asked for the root password. Press Enter to continue (there is no password yet).\\n- You will be asked if you want to change authentication method. Enter **n** and press Enter to continue.\\n- You will be asked if you want to set a root password. Enter **n** and press Enter to continue.\\n- You will be asked if you want to remove anonymous users. Enter **y** and press Enter to continue.\\n- You will be asked if you want to disallow root login remotely. Enter **y** and press Enter to continue.\\n- You will be asked if you want to remove the test database and access to it. Enter **y** and press Enter to continue.\\n- You will be asked if you want to reload privilege tables now. Enter **y** and press Enter to continue.\\n\\nNow I recommend setting a password for the root account, to do that you will need to open the MariaDB-Monitor (which is like a SQL Shell) by running \\n```bash\\nmysql -u root\\n```\\nand in there you can run the following SQL-Command to set the root-user-Password:\\n```sql\\nALTER USER \'root\'@\'localhost\' IDENTIFIED VIA mysql_native_password USING PASSWORD(\'<YOUR-PASSWORD>\');\\n```\\nafter that you exit the MariDB-Monitor by entering `exit`.  \\n\\n:::warning\\nEven though remote root access is disabled it is a good idea to deny all access to the database server by denying the port in the firewall. If you are using UFW (Which is the default firewall for ubuntu), you can just run the following command:\\n```bash\\nsudo ufw deny 3306\\nsudo ufw enable\\n```\\n:::\\n\\n### Setup of PHPMyAdmin\\n\\nTo install PHPMyAdmin you need to first download it by navigating to [phpmyadmin.net](https://www.phpmyadmin.net/) and then pressing the green download button in the top right corner. This will download PHPMyAdmin.\\n\\nNow navigate to your Downloads and unzip it by running:\\n```bash\\nunzip FILENAME.zip\\n```\\n\\nAfter it unzipped, you need to move to folder:\\n```bash\\nsudo mv FOLDER /var/www/phpmyadmin\\n```\\n\\nAfter that you will need to set the owner of the PHPMyAdmin-Directory to the nginx user so PHPMyAdmin can write there. You can do that by running:\\n```bash\\nsudo chown www-data:www-data -R /var/www/phpmyadmin\\n```\\n\\nNow you will just need to create a NGINX-configuration file for PHPMyAdmin as in the Section [Setup of NGINX](#setup-of-nginx):\\n\\n```yaml title=\\"/etc/nginx/sites-available/phpmyadmin\\"\\nserver {\\n        listen 3333;\\n        listen [::]:3333;\\n\\n        server_name localhost;\\n\\n        root /var/www/phpmyadmin;\\n        index index.html index.php;\\n\\n        location ~ \\\\.php$ {\\n               include snippets/fastcgi-php.conf;\\n               fastcgi_pass unix:/run/php/php8.3-fpm.sock;\\n        }\\n\\n        location / {\\n                try_files $uri $uri/ =404;\\n        }\\n}\\n```\\n:::warning\\nDo not forget to set the PHP-Version and (if wanted) another Port AND to link the file to sites-enabled and reload NGINX as in the Section [Setup of NGINX](#setup-of-nginx)\\n\\nIf you don\'t want PHPMyAdmin to be accessible from other devices I strongly recommend denying it in your firewall by running:\\n```bash\\nsudo ufw deny 3333\\nsudo ufw reload\\nsudo ufw enable\\n```\\n:::\\n\\n## That\'s it\\n\\nNow everything is set up to work, just restart all services by just following the rest of the tutorial or by running the following commands:\\n\\n```bash\\nsudo systemctl reload nginx\\nsudo systemctl reload php8.3-fpm\\nsudo systemctl restart mariadb\\n```\\n\\n## Further setup\\n\\nFor easier development (and full functionality) I still recommend taking some quick steps:\\n\\n### Shortcut-Commands\\nAs you may use your device not only for development you may want to be able to turn on or off all services quickly.\\n\\nFor that you need to first disable them starting at system startup:\\n```bash\\nsudo systemctl disable nginx\\nsudo systemctl disable mariadb\\nsudo systemctl disable php8.3-fpm\\n```\\n\\nAnd then you can add a bash shortcut to make it easy to stop and start these services. You do that by appending the following to the .bash_aliases file (e.g. using `nano ~/.bash_aliases`):\\n```bash title=\\"~/.bash_aliases\\"\\n# Development services\\nalias devon=\\"sudo systemctl start php8.3-fpm && sudo systemctl start nginx && systemctl start mariadb\\"\\nalias devoff=\\"sudo systemctl stop php8.3-fpm && sudo systemctl stop nginx && systemctl stop mariadb\\"\\n```\\nAfter re-opening the terminal (or running `source ~/.bash_aliases`), you can use the commands `devon` and `devoff` to turn on or off your services easily.\\n\\n### Finish PHPMyAdmin Setup\\n\\nAll of the following changes will need you to change something in the PHPMyAdmin configuration found under `/var/www/phpmyadmin/config.inc.php`. This _tutorial_ will not contain every step but just which variable to fill to shorten it a bit.\\n\\nFirst you will need to copy the sample configuration file to the actual configuration file by running:\\n```bash\\nsudo cp /var/www/phpmyadmin/config.sample.inc.php /var/www/phpmyadmin/config.inc.php\\n```\\n\\nFrom now on you can edit the configuration file by running:\\n```bash\\nsudo nano /var/www/phpmyadmin/config.inc.php\\n```\\n\\n#### Blowfish-Secret\\nThe blowfish secret is a key used for encryption of the session cookies. You should set it in the configuration.\\n\\n1. Generate a 32-bit secret by running \\n```bash\\nphp -r \'echo bin2hex(random_bytes(32)) . PHP_EOL;\'\\n```\\n2. Set the config variable `$cfg[\'blowfish_secret\']` in the following format:\\n```\\n$cfg[\'blowfish_secret\'] = sodium_hex2bin(\'f16ce59f45714194371b48fe362072dc3b019da7861558cd4ad29e4d6fb13851\');\\n```\\n\\n#### Configuration Storage\\nSetting up configuration storage is a little bit more complicated.\\n\\nYou will need access to the sql directory within the phpmyadmin directory, so i recommend copying it to a user-accessible folder: ```sudo cp -r /var/www/phpmyadmin/sql ~/```\\n\\nAfter that open the MariaDB-Monitor by running ```mysql -u root -p``` and entering the password set at [Setup of MariaDB](#setup-of-mariadb).\\n\\nThen run the following command to create a new user called `pma` which is the control user for PHPMyAdmin (replace the `###PASSWORD###` with a new password for the control user):\\n```sql\\nCREATE USER \'pma\'@\'localhost\' IDENTIFIED VIA mysql_native_password USING PASSWORD(\'###PASSWORD###\');GRANT ALL PRIVILEGES ON *.* TO \'pma\'@\'localhost\' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0; \\n```\\n\\nThen you will need to add the highlighted lines to the config:\\n```php title=\\"/var/www/phpmyadmin/config.inc.php\\"\\n$i++;\\n/* Authentication type */\\n$cfg[\'Servers\'][$i][\'auth_type\'] = \'cookie\';\\n/* Server parameters */\\n$cfg[\'Servers\'][$i][\'host\'] = \'localhost\';\\n$cfg[\'Servers\'][$i][\'compress\'] = false;\\n$cfg[\'Servers\'][$i][\'AllowNoPassword\'] = false;\\n// highlight-start\\n$cfg[\'Servers\'][$i][\'controluser\'] = \'pma\';\\n$cfg[\'Servers\'][$i][\'controlpass\'] = \'###PASSWORD###\';\\n// highlight-end\\n```\\n\\nTo finish the setup you will need to import the tables for the configuration storage by running the following command:\\n```bash\\nmysql -u root -p < ~/sql/create_tables.sql\\n```\\nIt will ask for the password of the root user and then import the tables.\\n\\nThat\'s it, you now have a fully working PHPMyAdmin setup.\\n\\n#### Theming PHPMyAdmin\\nAs I really like dark themes I always change the theme of PHPMyAdmin to a dark one. You can download themes from the [PHPMyAdmin-Theme-Repository](https://www.phpmyadmin.net/themes/) and then just extract them to the `/var/www/phpmyadmin/themes` directory.\\n\\n## Conclusion\\n\\nThat\'s it, you now have a fully working local server setup on your machine. I hope this tutorial was helpful and you can now easily develop your projects locally.\\n\\nThanks for reading :)"},{"id":"welcome","metadata":{"permalink":"/welcome","source":"@site/blog/2024-07-07-welcome/index.md","title":"Welcome","description":"Hi,","date":"2024-07-07T00:00:00.000Z","tags":[{"inline":false,"label":"ShareSimple","permalink":"/tags/sharesimple","description":"Simple and Easy-to-Use File-Sharing Service"},{"inline":false,"label":"Noten-App","permalink":"/tags/notenapp"},{"inline":false,"label":"OSLeM","permalink":"/tags/oslem","description":"OSLeM - OpenSource Legacy Manager"},{"inline":false,"label":"PresentStat","permalink":"/tags/presenstat","description":"Interactive polls in presentations"}],"readingTime":4.845,"hasTruncateMarker":true,"authors":[{"name":"Konstantin Protzen","title":"Hobby-Fullstack-Dev","url":"https://github.com/cuzimbisonratte","imageURL":"https://github.com/cuzimbisonratte.png","key":"konstantin"}],"frontMatter":{"slug":"welcome","title":"Welcome","authors":["konstantin"],"tags":["sharesimple","notenapp","oslem","presentstat"]},"unlisted":false,"prevItem":{"title":"Replacing XAMPP under Ubuntu","permalink":"/xampp-replacement"}},"content":"Hi,  \\nwelcome to this blog! This is the first post.\\n\\nI will be writing about various topics, including programming, software development, and other things.\\nAnd I will be sharing my thoughts and experiences with you.\\n\x3c!-- truncate --\x3e\\n\\n## Who am I?\\nFree-time programmer, interested in programming, software development and other IT-related-things.  \\nI am currently working on several projects, most of which are open source.  \\n\\nMy hometown is in Germany and I am currently still going to school.\\n\\n## What am I working on currently?\\n### Sharesimple\\nSharesimple is the most used project I am currently working on.\\nIt is a file sharing service that allows you to share files with others without having to register.\\n\\nThe idea behind it is to make file sharing as easy as possible, without any hassle.\\n\\nSo I asked myself how it would be possible to share files without having to sign up and still not have to worry about storage limits as the host.\\n\\nThe answer was simple, just limit the file size and the time the file is available.\\nSince I, as the hosting party, can see how many files are stored on the server and how much space they take up, I can easily estimate how much of the possible storage space will be used in the future and therefore limit the file size accordingly.\\n\\nThe project is fully open source and can be found on [GitHub](https://github.com/sharesimple).\\n\\nSo far the project has been well received and I am very happy about that.\\n\\nI am currently planning to add many new features to the project.\\nMy idea is to write an admin panel for the project, so that the hosting party can easily manage the files and see how much space is being used. It should also be possible to configure the service through the admin panel.  \\nAnother feature I am planning is to allow direct WebRTC file sharing, so that the files are not stored on the server, but are transferred directly from the sender to the receiver via WebRTC, with the help of an intermediary server that only establishes the connection and protects the privacy of the sender and receiver.\\n\\nThe last feature would include a new desktop client, which would necessarily include a new backend, as the current backend is not designed for external clients.  \\nI am not sure whether to write this as a PWA, which would be the easiest way to make it available on all platforms and would also be the easiest way for me to write it, or try to learn new languages and write it in one language so that it can be a native application on a limited number of platforms.\\n### Noten-App\\nNoten-App is a project I started a few years ago, but never really finished.\\n\\nIt is an app which allows Students to manage their grades and calculate their average grade. It also includes features like a homework planner.\\n\\nThe app sadly is really buggy and outdated, so I am planning to do a complete rewrite of the app if I find the time to do so, but in the meantime I am not working on it, which is sad because I think it is a really useful app, but there are more important things to do for me.\\n\\n### OSLeM\\nOSLeM is a new project for me, which leads me to get more into server-side programming in Node.js.\\n\\nIt is a project that is supposed to make it easy to manage your digital Legacy and to make sure that your data is not lost when you die, but is still protected from unauthorized access.\\n\\nThe project is still in the planning phase.\\n\\nMy idea is to write a server that stores the data and encrypts it in a way it can be decrypted only by the person who leaves the data behind OR by a person who has the decryption key or even require multiple peoples keys to decrypt the data.\\n\\nThe project is also planned to be open source.\\n\\nI also think about making it not only a web-app but also write a desktop client for it, so that the data can be accessed offline and the user can be sure that the data is not stored on a public-facing server, but the Legacy can also be managed by and be provided to a person that is not comfortable with using a web-app for this purpose.\\n\\n### PresentStat\\nThe last project I want to write about is PresentStat. \\n\\nPresentStat is a project that is supposed to make it easy to put interactive statistics into your presentations.\\n\\nThe project has a running prototype which is not yet ready for production, but I plan to release it when I find time for it.  \\nAs it is not a project that is very important to me, I only work on it when I have nothing else to do.\\n\\nThe project-prototype is also open source and can be found on [GitHub](https://github.com/cuzimbisonratte/presentstat).\\n\\nMy idea is to make it possible to create interactive statistics in your presentations, so that the audience can interact with the statistics and see immediately how the statistics change when the data changes.\\n\\nThe biggest feature I am currently planning is to make it possible for the server to stream automatically to YouTube, because some presentation softwares (e.g. Keynote on iPad) do not allow a Web-Page to be embedded into the presentation, but allow a video-stream to be embedded, so the only way to show the statistics would be to stream the statistics to YouTube and then embed the YouTube stream into the presentation.  \\nBut as that would be a very complex feature to code and switching to another window on the presenters computer is not really that hard, I am not sure if I will ever implement this feature."}]}}')}}]);