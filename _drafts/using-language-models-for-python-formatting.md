---
layout: post
title:  Python Formatting with Statistical Language Models
date:   2014-12-24 11:51:50
categories: naturalness hobbies
repo: eddieantonio/pywsngram
---

# Notes

 - using [NLTK][]
 - explain n-grams, idea, naturalness
 - explain why it might work
 - show off the implementation
 - how is the model constructed? What are the alternatives?
 - comparing it to PEP8
 - science

# Implementations

 - *n* in 1..10 --- $n=1$ is a control of sorts
 - use text (will require smoothing!) / use category / category with 
 - store wanted space only / store all spaces
 - tween-grams / no tween-grams

# Testing

 - Test against
    - itself
    - itself, pep8'd
 - See how the files match up to PEP8
 - See how the files match to themselves

# Caveats

 - context-sensitive features/indentation

# Future Work

 - need tokenizers

[NLTK]:     http://www.nltk.org/
