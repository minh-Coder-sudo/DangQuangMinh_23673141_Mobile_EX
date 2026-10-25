import { router } from "expo-router";
import { PhoneList } from "../../../components/Common";
import { PHONES } from "../../../data/phones";
import { useAppStateContext } from "../../../state/AppContext";
export default function Favorites() {
  const { ids } = useAppStateContext();
  return (
    <PhoneList
      phones={PHONES.filter((p) => ids.includes(p.id))}
      onSelect={(p) =>
        router.push({ pathname: "/catalog/[id]", params: { id: p.id } })
      }
    />
  );
}
