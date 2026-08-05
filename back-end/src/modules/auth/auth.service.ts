import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/env.js";
import { createUser, getUserByName, getUserById } from "../../db/repositories/auth.repository.js";
import makeError from "../../utils/makeError.js";
import { addWorkspaceMember, createWorkspace } from "../../db/repositories/workspace.repository.js";
import { createList } from "../../db/repositories/list.repository.js";
import { createTask } from "../../db/repositories/todo.repository.js";


export const register = async (name: string, password: string) => {
  const existing = await getUserByName(name);
  if (existing) throw makeError("The user has already registered", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, passwordHash);

  //create demo 
  const workspaceProduct = await createWorkspace("Product Team", user.id);
  await addWorkspaceMember(workspaceProduct.id, user.id , "owner");
  const adList = await createList(workspaceProduct.id, "Conduct an advertising campaign", 1);
  await createTask(adList.id,"Google ads",null,1,false,"high",user.id);
  const sponserList = await createList(workspaceProduct.id,"Seek sponsership",2);
  await createTask(sponserList.id,"Sell the family property","It costs 155M$.",1,false,"low",user.id);
  await createTask(sponserList.id,"Call Elon Musk","We should call him after he gets back from Mars.",2,false,"high",user.id);

  const workspaceDev = await createWorkspace("Developer Team", user.id);
  await addWorkspaceMember(workspaceDev.id, user.id , "owner");
  const frontList = await createList(workspaceDev.id, "Front-end", 1);
  await createTask(frontList.id,"Design the main page",null,1,true,"high",user.id);
  await createTask(frontList.id,"Implement the homepage","We use NEXT.js",2,true,"high",user.id);
  const backList = await createList(workspaceDev.id,"Back-end",2);
  await createTask(backList.id,"Test the API call","We use Swagger to help with API documentation.",1,true,"low",user.id);
  await createTask(backList.id,"Design cart service","It's already in github.",2,false,"medium",user.id);
  await createTask(backList.id,"Interview with a new Intern","He/She can be found at colleges.",3,true,"medium",user.id);
  await createTask(backList.id,"Sync up with the product team","Call them to set up a meeting",4,false,"high",user.id);
  const devList = await createList(workspaceDev.id,"DevOps",3);
  await createTask(devList.id,"Monitoring","Check and Delete the log files from the past month",1,false,"medium",user.id)

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });

  return { user, token };
};

export const login = async (name: string, password: string) => {
  const user = await getUserByName(name);
  if (!user) throw makeError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw makeError("Invalid credentials", 401);

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });

  return {
    token,
  };
};

export const me = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) throw makeError("User not found", 404);
  return user;
};
