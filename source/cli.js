#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import {checkOrCreateConfig, readConfig} from './utils.js';

checkOrCreateConfig();
const initialConfig = readConfig();

render(<App initialConfig={initialConfig} />);
