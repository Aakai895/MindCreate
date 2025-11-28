import React, { useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function Assinar({navigation}) {
  return (
    <SafeAreaView style={styles.container}> 
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Planos Creator</Text>
        <Text style={styles.headerSubtitle}>Escolha o plano ideal para você</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          <View style={[styles.card, styles.cardBasic]}>
            <View style={styles.cardHeader}>
              <Text style={styles.textoTitle}>MENSAL CREATOR</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>BÁSICO</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.textoPreco}>R$20,00</Text>
              <Text style={styles.periodText}>por mês</Text>
              <View style={styles.features}>
                <Text style={styles.featureText}>✓ Até 10 projetos</Text>
                <Text style={styles.featureText}>✓ Suporte básico</Text>
                <Text style={styles.featureText}>✓ Templates simples</Text>
              </View>
              <TouchableOpacity 
                style={styles.btn} 
                onPress={() => navigation.navigate('Selecao1')}
              >
                <Text style={styles.textoBTN}>SELECIONAR</Text>
                <Ionicons name="arrow-forward" size={16} color="#8B3A2D" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, styles.cardPro]}>
            <View style={styles.cardHeader}>
              <Text style={styles.textoTitle}>MENSAL CREATOR+</Text>
              <View style={[styles.badge, styles.proBadge]}>
                <Text style={styles.badgeText}>PRO</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.textoPreco}>R$50,00</Text>
              <Text style={styles.periodText}>por mês</Text>
              <View style={styles.features}>
                <Text style={styles.featureText}>✓ Projetos ilimitados</Text>
                <Text style={styles.featureText}>✓ Suporte prioritário</Text>
                <Text style={styles.featureText}>✓ Templates premium</Text>
                <Text style={styles.featureText}>✓ Análise de projetos</Text>
              </View>
              <TouchableOpacity 
                style={[styles.btn]} 
                onPress={() => navigation.navigate('Selecao2')}
              >
                <Text style={[styles.textoBTN]}>SELECIONAR</Text>
                <Ionicons name="arrow-forward" size={16} color="#8B3A2D" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, styles.cardPremium]}>
            <View style={styles.cardHeader}>
              <Text style={styles.textoTitle}>ANUAL CREATOR</Text>
              <View style={[styles.badge, styles.premiumBadge]}>
                <Text style={styles.badgeText}>PREMIUM</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.priceContainer}>
                <Text style={styles.textoPreco}>R$480</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-20%</Text>
                </View>
              </View>
              <Text style={styles.periodText}>por ano (R$40/mês)</Text>
              <View style={styles.features}>
                <Text style={styles.featureText}>✓ Todos os recursos PRO</Text>
                <Text style={styles.featureText}>✓ Mentoria personalizada</Text>
                <Text style={styles.featureText}>✓ Acesso antecipado</Text>
                <Text style={styles.featureText}>✓ Descontos em cursos</Text>
              </View>
              <TouchableOpacity 
                style={[styles.btn]} 
                onPress={() => navigation.navigate('Selecao3')}
              >
                <Text style={[styles.textoBTN]}>SELECIONAR</Text>
                <Ionicons name="arrow-forward" size={16} color="#8B3A2D" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 20,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    minHeight: 320, // Altura mínima para garantir que os botões fiquem visíveis
  },
  cardBasic: {
    backgroundColor: "#8B0000",
    borderColor: '#8B3A2D',
  },
  cardPro: {
    backgroundColor: "#8B0000",
    borderColor: '#FFD700',
  },
  cardPremium: {
    backgroundColor: "#8B0000",
    borderColor: '#E65C3F',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 20,
  },
  textoTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  proBadge: {
    backgroundColor: '#FFD700',
  },
  premiumBadge: {
    backgroundColor: '#FF6B35',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8B0000',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  textoPreco: {
    color: "#fff",
    fontSize: 32,
    fontWeight: '800',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  periodText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    opacity: 0.9,
  },
  features: {
    marginBottom: 24,
    flex: 1,
  },
  featureText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  proBtn: {
    backgroundColor: '#8B0000',
  },
  premiumBtn: {
    backgroundColor: '#8B0000',
  },
  textoBTN: {
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
    color: '#8B3A2D',
  },
  proBtnText: {
    color: '#fff',
  },
  premiumBtnText: {
    color: '#fff',
  },
});