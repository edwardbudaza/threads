"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import User from "../models/user.model";
import Community from "../models/community.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId }).populate({
            path: "communities",
            model: Community,
        }); 
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser(
    {
        username,
        userId,
        name,
        bio,
        image,
        path 
    } : Params
) : Promise<void> {
    try { 
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLocaleLowerCase(),
                name,
                bio,
                image,
                onboarded: true, 
            },
            { upsert: true }
        );

        if (path === "/profile/edit") {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
} 