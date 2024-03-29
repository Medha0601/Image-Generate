"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// crud operation

// Create
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    handleError(err);
  }
}

// Read
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    handleError(err);
  }
}

// Update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (err) {
    handleError(err);
  }
}

// delete
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // first we have to find the user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) throw new Error("User not found");

    // delete  user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (err) {
    handleError(err);
  }
}


// use credits
export async function updateCredits(userId:string, creditFee: number) {
    try{
        await connectToDatabase()

        const updateUserCredits = await User.findOneAndUpdate(
            {_id: userId},
            {$inc:{creditBalance: creditFee}},
            {new : true}
        )

        if(!updateUserCredits) throw new Error("User credit update failed")

        return JSON.parse(JSON.stringify(updateUserCredits))
    } catch(err)
    {
        handleError(err)
    }
}

