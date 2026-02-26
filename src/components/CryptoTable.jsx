import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function CryptoTable({ coins = [] }) {
  const navigate = useNavigate();

  return (
    <div className="w-11/12 mx-auto bg-[var(--color-bg-dark)]">
      
      <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Global Crypto Market Overview
        </h2>
      <div className="rounded-sm border border-white/10 overflow-hidden">
        
        <Table>
          <TableHeader>
            <TableRow className=" bg-white hover:bg-white/90 ">
              <TableHead className="font-bold">#</TableHead>
              <TableHead className="font-bold">Coin</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold">24h %</TableHead>
              <TableHead className="font-bold">Market Cap</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-white">
            {coins.map((coin) => (
              <TableRow
                key={coin.id}
                onClick={() => navigate(`/crypto/${coin.id}`)}
                className="cursor-pointer hover:bg-white/15 transition"
              >
                <TableCell>{coin.market_cap_rank}</TableCell>

                <TableCell className="flex items-center gap-3">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{coin.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </TableCell>

                <TableCell>₹{coin.current_price}</TableCell>

                <TableCell
                  className={
                    coin.price_change_percentage_24h > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {coin.price_change_percentage_24h?.toFixed(2) ?? "—"}%
                </TableCell>

                <TableCell>
                  ₹{(coin.market_cap / 1e12).toFixed(2)}T
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CryptoTable;
