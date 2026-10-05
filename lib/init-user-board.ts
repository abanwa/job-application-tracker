// When a user creates an accout, we will initialize their board
import connectDB from "./db";
import { Board, Column } from "./models"; // we are importing from

const DEFAULT_COLUMNS = [
  { name: "Wish List", order: 0 },
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
];
export async function initializeUserBoard(userId: string) {
  try {
    // we will connect the database
    await connectDB();

    // check if board already exists
    const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });

    if (existingBoard) {
      return existingBoard;
    }

    //create the initial board when user first registers with columns as empty array
    const board = await Board.create({
      name: "Job Hunt",
      userId,
      columns: [],
    });

    // Create the default Column
    const columns = await Promise.all(
      DEFAULT_COLUMNS.map((col) =>
        Column.create({
          name: col.name,
          order: col.order,
          boardId: board._id,
          jobApplication: [],
        }),
      ),
    );

    // Update the board with the new column Ids
    board.columns = columns.map((col) => col._id);
    await board.save();

    return board;
  } catch (err) {
    throw err;
  }
}
