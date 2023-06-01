
# Project

This project is a subset of a larger codebase, specifically focusing on a challenging problem of integrating a sticky note object into a fabric.js canvas. 

## The Problem

Our team is currently grappling with difficulties in text adjustment within the sticky note's boundaries. Pointedly, the challenge lies in text wrapping, font resizing, and issues with caret functionality. It's a delicate process and requires careful calculation and handling, especially given the intricacies of fabric.js. 

## The Goal

The objective of this project is to address these challenges and deliver a perfectly editable text within a sticky note’s area on a fabric.js canvas. Precisely, the desired features include:

1. Perfectly editable text within a sticky note’s area, which grows/shrinks and wraps as to stay always inside the available space of the sticky note, with no caret problems.
2. Compatibility with different font families. It doesn’t need to be working with unorthodox fonts, but different fonts are required since the user will be able to change fonts at runtime.
3. Text utilization of the maximum space available, or very close to that, without exceeding the sticky note’s area.

## Getting Started

To run the project, run the following command:

```bash
npm run web
```

Once the canvas is seen, go to the tools menu to the right and click the third button from top to down. Next, click on the canvas. A sticky note will be shown. Type then anything there so that you can see the problem with the caret, which sometimes "snaps". Also, try to click anywhere in the text and type from there. As you can see, the caret is not acting right. The bigger the text is, the more obvious the problem becomes.

Please, make sure the problem is solved for at least the latest versions of Chrome and Firefox.

## Angular files

Go to "/src/app/components/canvas/services/canvas-manager.service.ts". In this file you will find the method called “handleStickyNote()”. This is the method that is triggered every time the user clicks the canvas with the intent of creating a new sticky note. The entire logic of text wrapping, growing/shrinking is there.