import { useState } from "react";
import { TextInput, View } from "react-native";
import { PhoneList } from "../../components/Common";
import { PHONES } from "../../data/phones";
import { s } from "../../theme";
export default function Search() {
  const [keyword, setKeyword] = useState("");
  const result = PHONES.filter((p) =>
    p.name
      .toLocaleLowerCase("vi")
      .includes(keyword.trim().toLocaleLowerCase("vi")),
  );
  return (
    <View style={s.root}>
      <View style={{ padding: 16 }}>
        <TextInput
          accessibilityLabel="Tìm sản phẩm"
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Nhập từ khóa"
          style={s.input}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <PhoneList phones={result} empty={`Không có kết quả cho “${keyword}”`} />
    </View>
  );
}
