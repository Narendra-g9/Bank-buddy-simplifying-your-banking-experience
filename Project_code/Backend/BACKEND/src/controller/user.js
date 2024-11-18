import mongoose from 'mongoose';

export const transferAmount = async (req, res) => {
  const { destinationAccount } = req.body;
  const amount = Number(req.body.amount);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const decoded = verifyUserToken(token);
    if (!decoded) {
      return res.status(401).send({ msg: "Access Token is Invalid" });
    }

    const userid = decoded.id;
    const getsourceAccount = await Account.findOne({
      accUser: userid,
    }).session(session);

    if (amount > getsourceAccount.accBalance) {
      await session.abortTransaction();
      return res.send({ msg: `Your account balance is insufficient to transfer` });
    }

    getsourceAccount.accBalance -= amount;
    const savedAccount = await getsourceAccount.save();

    const getdestinationAccount = await Account.findOne({
      accNumber: destinationAccount,
    }).session(session);
    if (!getdestinationAccount) {
      await session.abortTransaction();
      return res.send({ msg: "Destination Account Not Found" });
    }

    getdestinationAccount.accBalance += amount;
    const saveddestinationAccount = await getdestinationAccount.save();

    const transferAmountTransaction = await Transfer.create([
      {
        accountNumber: getsourceAccount.accNumber,
        destinationAccount: destinationAccount,
        accUser: getsourceAccount.accUser,
        destUser: getdestinationAccount.accUser,
        amount: amount,
      },
    ]);

    await session.commitTransaction();

    res.send({
      msg: `Amount transferred from ${getsourceAccount.accNumber} to ${destinationAccount} successfully`,
    });

  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(400).send({ error: err.message });
  } finally {
    session.endSession();
  }
};
