import { Profile } from "../../components/Common";
import { useAppStateContext } from "../../state/AppContext";
export default function Screen() {
  const { dark } = useAppStateContext();
  return <Profile dark={dark} />;
}
