---
layout: project
title: "Scuffed Satellites"
date: 2025-08-20
lead: "Much worse than the other thing"
image: /assets/projectImages/scuffedSatellites.png
---

This is a really scuffed satellite tracker. Basically, I thought something I created using the `curses` display at an internship was really cool so I made something for that using the N2YO satellite api.

***
***
***

It is pretty scuffed and not nearly as cool as the thing I created at the internship, but at the same time, it uses `curses` and was probably the first time I've interacted with an API of any sort (that being the N2YO one). You can find the codebase <a href="https://github.com/melthorm/BadSatData" target="_blank">here</a>. Main thing is you just clone the git repo and then run the thing. It's probably possible to embed it in a website, but then I feel like I'd be calling the N2YO API too much and I'd probably get blacklisted. So uh, yeah, just run the thing.

`I kind of used a scuffed way to make the API and curses update in parallel but like it works well enough so who cares (it is actually rather bad that I am not doing it in a better way but at the same time, I've thought about it a long time and can't think of a better solution). Also, I do not know nearly enough about GPS to know what important aspects can be extracted using longitude, latitude, altitude, etc.`
