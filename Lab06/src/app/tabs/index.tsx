import { PhoneList } from "../../components/Common";
import { PHONES } from "../../data/phones";
export default function Home() {
  return <PhoneList phones={PHONES} />;
}
