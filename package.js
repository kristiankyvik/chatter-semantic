Package.describe({
  name: 'chatter:semantic',
  version: '0.0.1',
  summary: 'UI package for chatter using the Semantic UI framework',
  git: 'git@github.com:jorgeer/chatter-semantic.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  
  api.use([
    'ecmascript',
    'chatter:core'
  ]);

  api.imply('chatter:core');
  
  api.addFiles([
    'client/room.jade',    
    'client/roomList.jade',
    'client/users.jade',   
    'client/writer.jade',  
    'client/nav.jade',     
    'client/chatter.jade', 
    
    'client/room.js',      
    'client/roomList.js',  
    'client/users.js',     
    'client/writer.js',    
    'client/nav.js',       
    'client/chatter.js',
    
    'client/styles.styl',
  ], ['client']);
  
  api.use([
    'reactive-dict',
    'templating',
    'jquery',
    'session',
    
    'mquandalle:jade@0.4.5',
    'mquandalle:stylus',
  ], 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('chatter:semantic');
  api.addFiles('chattersemantic-tests.js');
});
