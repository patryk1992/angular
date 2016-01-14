var myApp=angular.module('Blue',['ngRoute','ngTable','ngCookies']);

myApp.constant('USER_ROLES', {
  all: '*',
  admin: 'ROLE_ADMIN',
  expert: 'ROLE_EXPERT',
  annotator: 'ROLE_ANNOTATOR',
  banned: 'ROLE_BANNED'
});
