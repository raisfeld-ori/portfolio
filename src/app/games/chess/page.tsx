import ChessBoard from "@/components/Chess";
import { Container } from "@/components/Container";

export default function Chess(){
    return <Container className="mt-16 sm:mt-32">
        <ChessBoard></ChessBoard>
    </Container>
}