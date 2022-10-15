import { useState, useEffect } from "react"
import supabase from "./client"

export default function App() {
  const options = ["rock", "paper", "scissors"]

  //a ton of states :|
  const [status, setStatus] = useState("---")

  const [botChose, setBotChose] = useState("---")
  const [youChose, setYouChose] = useState("---")

  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [ties, setTies] = useState(0)
  const [roundsPlayed, setRoundsPlayed] = useState(0)

  const [loading, setLoading] = useState(false)

  //messages
  const winMsg = "you won",
    lostMsg = "you lost",
    tieMsg = "a tie"

  const a = "rock",
    b = "paper",
    c = "scissors"

  //fetched variables
  let fetchedWins
  let fetchedRoundsPlayed

  //actual code
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let { data: roundsPlayed, err } = await supabase
        .from("stats")
        .select("*")
        .eq("id", 1)
      let { data: wins, error } = await supabase
        .from("stats")
        .select("*")
        .eq("id", 2)
      fetchedWins = JSON.stringify(wins[0].value)
      fetchedRoundsPlayed = JSON.stringify(roundsPlayed[0].value)
      setLoading(true)
      setRoundsPlayed(parseInt(fetchedRoundsPlayed))
      setWins(parseInt(fetchedWins))
    }

    fetchData()
  }, [])

  function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length)
    const item = arr[randomIndex]
    return item
  }

  async function handleOption(option) {
    const botOption = getRandomItem(options)
    setBotChose(botOption)
    setRoundsPlayed(roundsPlayed + 1)

    const { data: updatedRoundsPlayed, error } = await supabase
      .from("stats")
      .update({ value: roundsPlayed + 1 })
      .eq("id", 1)

    if (option == "rock") {
      setYouChose("rock")
      if (botOption == "paper") {
        setStatus(lostMsg)
        setLosses(losses + 1)
      }
      if (botOption == "scissors") {
        setStatus(winMsg)
        setWins(wins + 1)
      }
      if (botOption == "rock") {
        setStatus(tieMsg)
        setTies(ties + 1)
      }
    }

    if (option == "paper") {
      setYouChose("paper")
      if (botOption == "scissors") {
        setStatus(lostMsg)
        setLosses(losses + 1)
      }
      if (botOption == "rock") {
        setStatus(winMsg)
        setWins(wins + 1)
      }
      if (botOption == "paper") {
        setStatus(tieMsg)
        setTies(ties + 1)
      }
    }

    if (option == "scissors") {
      setYouChose("scissors")
      if (botOption == "rock") {
        setStatus(lostMsg)
        setLosses(losses + 1)
      }
      if (botOption == "paper") {
        setStatus(winMsg)
        setWins(wins + 1)
      }
      if (botOption == "scissors") {
        setStatus(tieMsg)
        setTies(ties + 1)
      }
    }

    const { data: updatedWins, errorr } = await supabase
      .from("stats")
      .update({ value: wins + 1 })
      .eq("id", 2)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] text-center">
      <header className="mb-12">
        <h1 className="font-bold text-3xl">ROSHAMBO GAME</h1>
        <p className="text-lg">
          pick your poison <span className="hue-rotate-60 ml-[-5px]">💧</span>
        </p>
      </header>
      <nav className="flex justify-center gap-5">
        <button className="option" onClick={() => handleOption("rock")}>
          🪨
        </button>
        <button className="option" onClick={() => handleOption("paper")}>
          📃
        </button>
        <button className="option" onClick={() => handleOption("scissors")}>
          ✂️
        </button>
      </nav>
      <main className="mt-4 text-lg">
        <h1>
          <div>
            Status:{" "}
            <span
              className={` ${
                status == winMsg
                  ? "text-green-500"
                  : status == lostMsg
                  ? "text-red-500"
                  : status == tieMsg
                  ? "text-blue-500"
                  : "text-black"
              }`}
            >
              {status}
            </span>
          </div>
          <div>
            <p>
              Bot Chose:{" "}
              <span className="">
                {botChose == a
                  ? "🪨"
                  : botChose == b
                  ? "📃"
                  : botChose == c
                  ? "✂️"
                  : "---"}
              </span>
            </p>
            <p>
              You Chose:{" "}
              <span className="">
                {youChose == a
                  ? "🪨"
                  : youChose == b
                  ? "📃"
                  : youChose == c
                  ? "✂️"
                  : "---"}
              </span>
            </p>
          </div>
        </h1>
      </main>
      <main className="mt-4 text-lg">
        <h1>
          Global Win Rate:{" "}
          <span className="font-medium bg-gray-200 rounded p-1">
            {Math.round((wins / roundsPlayed) * 100 * 100) / 100 + "%"}
          </span>
        </h1>
      </main>
    </div>
  )
}
