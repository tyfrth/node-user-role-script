require('dotenv').config();
const { ManagementClient } = require('auth0');

const management = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
 // scope: 'create:users delete:users create:roles assign:roles'
});

const users = Array.from({ length: 10 }, (_, i) => ({
  user_id: `rolePermissionsTest${i}`,
  email: `Testuser${i}@example.com`,
  password: 'Password123',
  connection: 'Username-Password-Authentication', // replace with your connection
}));

const createUsers = async () => {
  for (const user of users) {
    const createdUser = await management.createUser(user);
    console.log(`User ${createdUser.email} created with user_id ${createdUser.user_id}`);
    user.user_id = createdUser.user_id;
  }
};

const deleteUsers = async () => {
  for (const user of users) {
    await management.deleteUser({ id: 'auth0|' + user.user_id });
    console.log(`User ${user.email} deleted`);
  }
};

const assignRoleToUsers = async (roleId) => {
  for (const user of users) {
    await management.assignRolestoUser({ id: user.user_id }, { roles: [roleId] });
    console.log(`Role ${roleId} assigned to user ${user.email}`);
  }
};

const main = async () => {
  try {
    const preExistingRoleId = 'rol_l92D7c8WopQrR7Xv';

   await createUsers();
   await assignRoleToUsers(preExistingRoleId);
  // await deleteUsers();

  //  await createUsers();
  //  await assignRoleToUsers(role.id);
  } catch (error) {
    console.error(error);
  }
};

main();

