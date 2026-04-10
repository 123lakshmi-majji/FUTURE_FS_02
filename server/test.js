console.log('Test script started');
require('dotenv').config();
console.log('Dotenv loaded, env PORT:', process.env.PORT);
const express = require('express');
console.log('Express loaded');
const mongoose = require('mongoose');
console.log('Mongoose loaded');
console.log('All modules loaded successfully');