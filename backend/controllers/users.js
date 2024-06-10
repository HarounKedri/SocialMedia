import User from "../models/User.js";

/* READ */
export const getUsers = async (req, res) => {
    try {
       
        const users = await User.find();
        res.status(200).json(users);
    }catch (err){
        res.status(404).json({message: err.message});
    }
}
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch (err){
        res.status(404).json({message: err.message});
    }
}

/* GET USER FRIENDS */
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, picturePath }) => {
        return { _id, firstName, lastName, occupation, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
  


/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend not found" });
    }

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
      friend.friends = friend.friends.filter((user) => user.toString() !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  
  

// Controller to add a friend
export const addFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Find the user who wants to add a friend
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the friend is already in the user's friends list
        if (user.friends.includes(friendId)) {
            return res.status(400).json({ message: "User is already in your friends list" });
        }

        // Add the friend to the user's friends list
        user.friends.push(friendId);
        await user.save();

        res.status(200).json({ message: "Friend added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Search for users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
      ],
    }).select("_id firstName lastName picturePath");
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

