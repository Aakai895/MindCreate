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
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="pencil-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === "ATIVOS" && styles.activeTabButton]}
          onPress={() => setActiveTab("ATIVOS")}
        >
          <Text style={[styles.tab, activeTab === "ATIVOS" && styles.activeTab]}>
            ATIVOS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === "REVISANDO" && styles.activeTabButton]}
          onPress={() => setActiveTab("REVISANDO")}
        >
          <Text style={[styles.tab, activeTab === "REVISANDO" && styles.activeTab]}>
            REVISANDO
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CriarProd')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff5e6" 
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: "#8B0000",
  },
  tab: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8B0000",
    letterSpacing: 0.5,
  },
  activeTab: {
    color: "#fff",
  },
  listContent: { 
    padding: 20,
    paddingBottom: 80,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#8B0000",
    marginRight: 16,
  },
  info: { 
    flex: 1,
  },
  title: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 6,
    color: "#8B0000",
    lineHeight: 20,
  },
  price: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#8B0000",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#8B0000",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});