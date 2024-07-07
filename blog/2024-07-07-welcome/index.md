---
slug: welcome
title: Welcome
authors: [konstantin]
tags: [sharesimple, notenapp, oslem, presentstat]
---

Hi,  
welcome to this blog! This is the first post.

I will be writing about various topics, including programming, software development, and other things.
And I will be sharing my thoughts and experiences with you.
<!-- truncate -->

## Who am I?
Free-time programmer, interested in programming, software development and other IT-related-things.  
I am currently working on several projects, most of which are open source.  

My hometown is in Germany and I am currently still going to school.

## What am I working on currently?
### Sharesimple
Sharesimple is the most used project I am currently working on.
It is a file sharing service that allows you to share files with others without having to register.

The idea behind it is to make file sharing as easy as possible, without any hassle.

So I asked myself how it would be possible to share files without having to sign up and still not have to worry about storage limits as the host.

The answer was simple, just limit the file size and the time the file is available.
Since I, as the hosting party, can see how many files are stored on the server and how much space they take up, I can easily estimate how much of the possible storage space will be used in the future and therefore limit the file size accordingly.

The project is fully open source and can be found on [GitHub](https://github.com/sharesimple).

So far the project has been well received and I am very happy about that.

I am currently planning to add many new features to the project.
My idea is to write an admin panel for the project, so that the hosting party can easily manage the files and see how much space is being used. It should also be possible to configure the service through the admin panel.  
Another feature I am planning is to allow direct WebRTC file sharing, so that the files are not stored on the server, but are transferred directly from the sender to the receiver via WebRTC, with the help of an intermediary server that only establishes the connection and protects the privacy of the sender and receiver.

The last feature would include a new desktop client, which would necessarily include a new backend, as the current backend is not designed for external clients.  
I am not sure whether to write this as a PWA, which would be the easiest way to make it available on all platforms and would also be the easiest way for me to write it, or try to learn new languages and write it in one language so that it can be a native application on a limited number of platforms.
### Noten-App
Noten-App is a project I started a few years ago, but never really finished.

It is an app which allows Students to manage their grades and calculate their average grade. It also includes features like a homework planner.

The app sadly is really buggy and outdated, so I am planning to do a complete rewrite of the app if I find the time to do so, but in the meantime I am not working on it, which is sad because I think it is a really useful app, but there are more important things to do for me.

### OSLeM
OSLeM is a new project for me, which leads me to get more into server-side programming in Node.js.

It is a project that is supposed to make it easy to manage your digital Legacy and to make sure that your data is not lost when you die, but is still protected from unauthorized access.

The project is still in the planning phase.

My idea is to write a server that stores the data and encrypts it in a way it can be decrypted only by the person who leaves the data behind OR by a person who has the decryption key or even require multiple peoples keys to decrypt the data.

The project is also planned to be open source.

I also think about making it not only a web-app but also write a desktop client for it, so that the data can be accessed offline and the user can be sure that the data is not stored on a public-facing server, but the Legacy can also be managed by and be provided to a person that is not comfortable with using a web-app for this purpose.

### PresentStat
The last project I want to write about is PresentStat. 

PresentStat is a project that is supposed to make it easy to put interactive statistics into your presentations.

The project has a running prototype which is not yet ready for production, but I plan to release it when I find time for it.  
As it is not a project that is very important to me, I only work on it when I have nothing else to do.

The project-prototype is also open source and can be found on [GitHub](https://github.com/cuzimbisonratte/presentstat).

My idea is to make it possible to create interactive statistics in your presentations, so that the audience can interact with the statistics and see immediately how the statistics change when the data changes.

The biggest feature I am currently planning is to make it possible for the server to stream automatically to YouTube, because some presentation softwares (e.g. Keynote on iPad) do not allow a Web-Page to be embedded into the presentation, but allow a video-stream to be embedded, so the only way to show the statistics would be to stream the statistics to YouTube and then embed the YouTube stream into the presentation.  
But as that would be a very complex feature to code and switching to another window on the presenters computer is not really that hard, I am not sure if I will ever implement this feature.