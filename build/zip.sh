!#!/usr/bin/env bash
  for i in */; do cd $i; zip -r "${i%/}.zip" *; mv "${i%/}.zip" .. ; cd .. ;done