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
    'jorgeer:chatter-core@0.1.0'
  ]);

  api.imply('jorgeer:chatter-core@0.1.0');

  api.addFiles([
    'client/ChatterApp.jsx',
    'client/Task.jsx',
    'client/chatter.html',
    'client/chatter.js',

    'client/components/Nav.jsx',
    'client/components/RoomList.jsx',
    'client/components/Room.jsx',
    'client/components/Settings.jsx',
    'client/components/Writer.jsx',
    'client/components/NewRoom.jsx',


    'client/styles.styl',
  ], ['client']);

  api.use([
    'session',
    'react',
    'templating',
    'react-template-helper',
    'react-meteor-data',

    'mquandalle:stylus@1.0.10',
  ], 'client');

  api.export([
    'ChatterApp'
  ]);

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jorgeer:chatter-semantic');
  api.addFiles('chattersemantic-tests.js');
});
