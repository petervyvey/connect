#!/usr/bin/env node

/**
 * Initialize database
 */

require('../server');


/**
 * Dependencies
 */

var async = require('async')
  , Role  = require('../models/Role')
  , Scope = require('../models/Scope')
  ;


/**
 * Data
 */

var defaultRoles = [
  { name: 'authority' },
  { name: 'developer' }
];

var defaultScopes = [
  { name: 'openid',   description: 'View your identity' },
  { name: 'profile',  description: 'View your basic account info' },
  { name: 'client',   description: 'Register and configure clients' },
  { name: 'realm',    description: 'Configure the security realm' }
];

var defaultRoleScopes = [
  ['authority', 'realm'],
  ['developer', 'client']
];


/**
 * Persist
 */

function insertRoles (done) {
  async.map(defaultRoles, function (role, callback) {
    Role.insert(role, function (err, instance) {
      callback(err, instance);
    })
  }, function (err, roles) {
    console.log('Created default roles.');
    done(err, roles);
  });
}

function insertScopes (done) {
  async.map(defaultScopes, function (scope, callback) {
    Scope.insert(scope, function (err, instance) {
      callback(err, instance);
    })
  }, function (err, scopes) {
    console.log('Created default scopes.');
    done(err, scopes);
  });
}

function assignScopesToRoles (done) {
  async.map(defaultRoleScopes, function (pair, callback) {
    Role.addScopes(pair[0], pair[1], function (err, result) {
      callback(err, result);
    });
  }, function (err, results) {
    console.log('Created default role scope assignments.');
    done(err, results);
  })
}

async.parallel([
  insertRoles,
  insertScopes,
  assignScopesToRoles
], function (err, results) {
  console.log('Ready to run.');
  process.exit();
});
