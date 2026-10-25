import { router } from "expo-router";
import { PhoneList } from "../../../components/Common";
import { PHONES } from "../../../data/phones";
export default function Products() {
  return (
    <PhoneList
      phones={PHONES}
      onSelect={(p) =>
        router.push({ pathname: "/catalog/[id]", params: { id: p.id } })
      }
    />
  );
}
