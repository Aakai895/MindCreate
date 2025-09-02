import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProdutosScreen({ navigation }) {

  const [activeTab, setActiveTab] = useState("ATIVOS");


  const produtosAtivos = [
    {
      id: "1",
      titulo: "Receita de Abelha Simples com Asas e Três Listras Pretas",
      preco: "R$10,00",
    },
  ];

  const produtosRevisando = [
    {
      id: "2",
      titulo: "Receita de Borboleta Colorida",
      preco: "R$15,00",
    },
  ];


  const data = activeTab === "ATIVOS" ? produtosAtivos : produtosRevisando;

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      <View style={styles.imagePlaceholder} />
      
      <View style={styles.info}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.price}>{item.preco}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("ATIVOS")}>
          <Text style={[styles.tab, activeTab === "ATIVOS" && styles.activeTab]}>
            ATIVOS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("REVISANDO")}>
          <Text style={[styles.tab, activeTab === "REVISANDO" && styles.activeTab]}>
            REVISANDO
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CriarProd')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf5ed" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tab: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#a89c92", 
  },
  activeTab: {
    color: "#c14b3b", 
    borderBottomWidth: 2,
    borderColor: "#c14b3b",
    paddingBottom: 4,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  price: { fontSize: 13, color: "#666" },
  actions: {
    flexDirection: "row",
    gap: 10,
  },

  fab: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#c14b3b",
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

});
