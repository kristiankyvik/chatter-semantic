Package.describe({
  name: 'jorgeer:chatter-semantic',
  version: '0.1.0',
  summary: 'UI package for chatter using the Semantic UI framework',
  git: 'git@github.com:jorgeer/chatter-semantic.git',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');

  api.use([
    'ecmascript',
    'jorgeer:chatter-core@0.1.0'
  ]);

  api.imply('jorgeer:chatter-core@0.1.0');

  api.addFiles([
    'client/chatter.html',
    'client/chatter.js',
    'client/ChatterApp.jsx',

    'client/variables.styl',
    'client/styles.styl',
  ], ['client']);

  api.addAssets('public/images/avatar.jpg', 'client');
  api.addAssets('public/images/default.jpg', 'client');

  api.use([
    'session',
    'templating',
    'react-template-helper@0.2.7',
    'react-meteor-data',
    'meteorhacks:subs-manager',
    'mquandalle:stylus@1.0.10',
    'momentjs:moment@2.8.4',
    'ccorcos:subs-cache'
  ], 'client');

  api.export([
    'ChatterApp'
  ]);

  api.mainModule("main.js", "client");
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('practicalmeteor:chai');
  api.use('jorgeer:chatter-semantic');
  api.use('xolvio:cleaner');
  api.use('practicalmeteor:sinon');
  api.addFiles('chattersemantic-tests.js');
});
