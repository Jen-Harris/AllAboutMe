const test = require('tape');
const dbReset = require('../src/model/database/db_seed');
const dbConnection = require('../src/model/database/db_connection');

const { addUser, getUser } = require('../src/model/user_queries');
const { saveAboutMe } = require('../src/model/form_queries');

const { getGenerator, insertGenerator } = require('../src/model/queryGenerator');

test('Insert user into database', (t) => {
  dbReset()
    .then(() => {
      return addUser('jam', 'jam1@gmail.com', 'password');
    })
    .then((id) => {
      t.equal(typeof id, 'number', 'Returns a number (the user id)');
      return addUser('jon', 'jam1@gmail.com', 'password');
    })
    .then(() => {
      t.fail('Returns rejected promise if user already exists');
      t.end();
    })
    .catch(() => {
      t.pass('Returns rejected promise if user already exists');
      t.end();
    });
});

test('Get user based on email', (t) => {
  dbReset()
    .then(() => {
      return getUser('jam@gmail.com');
    })
    .then(userObj => {
      const expected = {
        name: 'jam',
        email: 'jam@gmail.com',
        password: 'password',
      };
      Object.keys(expected).forEach(key => {
        t.equal(userObj[key], expected[key], `Returns object with same ${key}`);
      });
      t.end();
    });
});

//test('Insert about_me section into database', (t) => {
  //dbReset('db_build.sql')
    //.then(() => {
      //dbReset('db_seed.sql');
    //})
    //.then(() => {
      //const userData = {
        //name: 'bob',
        //email: 'bobdylan@gmail.com',
        //password: 'supersecurepassword',
      //};
      //return addUser(userData);
    //})
    //.then(userId => {
      //const aboutMeData = {
        //user_id: userId,
        //likes: 'bananas',
        //dislikes: 'dogs',
        //strengths: 'harmonica',
        //weaknesses: 'swimming',
      //};
      //return saveAboutMe(aboutMeData);
    //})
    //.then(() => {

    //})
    //.then((actual) => {
      //const expected = {
        //likes: 'bananas',
        //dislikes: 'dogs',
        //strengths: 'harmonica',
        //weaknesses: 'swimming',
      //};
      //Object.keys(expected).forEach(key => {
        //t.equal(actual[key], expected[key], `
      //});
      //t.end();
    //});
//});

test( 'queryGenerator', (t) => {

  const expected ='INSERT INTO about_me (user_id, likes, dislikes, strengths, weaknesses, uncomfortable, safe) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (user_id) DO UPDATE SET (likes, dislikes, strengths, weaknesses, uncomfortable, safe) = ($2, $3, $4, $5, $6, $7)';

  const actual = insertGenerator('aboutMe');

  t.equal (actual, expected, 'should return correct sql query');
  t.end();
});

test.onFinish( () => process.exit());
