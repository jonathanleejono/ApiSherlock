#!/usr/bin/env bash
cd ..
cd backend && git config core.hooksPath ../.husky
cd ..
cd client && git config core.hooksPath ../.husky
cd ..
