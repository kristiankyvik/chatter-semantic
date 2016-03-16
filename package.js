Package.describe({
  name: 'jorgeer:chatter-semantic',
  version: '0.1.0',
  summary: 'UI package for chatter using the Semantic UI framework',
  git: 'git@github.com:jorgeer/chatter-semantic.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');

  api.use([
    'ecmascript',
    'jorgeer:chatter-core@0.1.0',
    'react'
  ]);

  api.imply('jorgeer:chatter-core@0.1.0');

  api.addFiles([
    'client/App.jsx',
    'client/Task.jsx',
    'client/room.jade',
    'client/roomList.jade',
    'client/users.jade',
    'client/writer.jade',
    'client/nav.jade',
    'client/chatter.jade',
    'client/newRoom.jade',
    'client/settings.jade',


    'client/room.js',
    'client/roomList.js',
    'client/users.js',
    'client/writer.js',
    'client/nav.js',
    'client/chatter.js',
    'client/newRoom.js',
    'client/settings.js',


    'client/styles.styl',
  ], ['client']);

  api.use([
    'reactive-dict',
    'templating',
    'jquery',
    'session',
    'react',

    'mquandalle:jade@0.4.5',
    'mquandalle:stylus@1.0.10',
  ], 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jorgeer:chatter-semantic');
  api.addFiles('chattersemantic-tests.js');
});
