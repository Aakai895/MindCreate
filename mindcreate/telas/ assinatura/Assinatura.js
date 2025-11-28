import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Modal,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get('window');

export default function Inicialscreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(height));

  const beneficios = [
    "Acesso a conteúdo exclusivo",
    "Suporte prioritário",
    "Descontos especiais",
    "Eventos online",
    "Comunidade privada",
    "Material bônus",
    "Atualizações constantes",
  ];

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minha Assinatura</Text>
        </View>

        {/* Card Principal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>MENSAL CREATOR</Text>
              <Text style={styles.cardPrice}>R$ 20,00/mês</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ATIVA</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color="#fff" />
              <Text style={styles.infoText}>Titular: <Text style={styles.infoBold}>Dalva Figueira</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.infoText}>Status: <Text style={styles.infoBold}>Pago</Text></Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={styles.infoText}>Próximo pagamento: <Text style={styles.infoBold}>01/08</Text></Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton}>
            <Ionicons name="close-circle-outline" size={20} color="#ff6b6b" />
            <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.changeButton} onPress={() => navigation.navigate('Assinar')}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#8B0000" />
            <Text style={styles.changeButtonText}>Trocar Assinatura</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Benefícios */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>BENEFÍCIOS INCLUÍDOS</Text>
          <View style={styles.benefitsList}>
            {beneficios.map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark" size={16} color="#8B0000" />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botão para Assinar/Ver Detalhes */}
        <TouchableOpacity style={styles.signButton} onPress={openModal}>
          <Text style={styles.signButtonText}>Ver Detalhes da Assinatura</Text>
          <Ionicons name="chevron-up-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            onPress={closeModal}
            activeOpacity={1}
          />
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Assinatura</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8B0000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Resumo da Assinatura */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Resumo</Text>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Plano</Text>
                  <Text style={styles.summaryValue}>MENSAL CREATOR</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Valor</Text>
                  <Text style={styles.summaryValue}>R$ 20,00/mês</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Próxima cobrança</Text>
                  <Text style={styles.summaryValue}>01/08/2024</Text>
                </View>
              </View>

              {/* Método de Pagamento */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Método de Pagamento</Text>
                <View style={styles.paymentMethod}>
                  <Ionicons name="card-outline" size={20} color="#8B0000" />
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentText}>Cartão de Crédito</Text>
                    <Text style={styles.paymentDetail}>•••• 1234 (Visa)</Text>
                  </View>
                  <TouchableOpacity style={styles.changePaymentButton}>
                    <Text style={styles.changePaymentText}>Alterar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Benefícios Detalhados */}
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Benefícios</Text>
                {beneficios.map((item, index) => (
                  <View key={index} style={styles.detailedBenefit}>
                    <Ionicons name="checkmark-circle" size={20} color="#8B0000" />
                    <Text style={styles.detailedBenefitText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Botão de Assinar/Confirmar */}
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar Assinatura</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B0000',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(139, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: "#8B0000",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#8B0000',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardPrice: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.9,
    marginTop: 6,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  cardInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '600',
  },
  infoBold: {
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontWeight: '800',
    fontSize: 14,
  },
  changeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeButtonText: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: 14,
  },
  benefitsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  benefitsTitle: {
    color: "#8B0000",
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    color: "#8B0000",
    fontSize: 15,
    fontWeight: '600',
  },
  signButton: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.85,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B0000',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#fff5e6',
    borderRadius: 20,
  },
  modalBody: {
    padding: 24,
  },
  modalSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    color: '#8B0000',
    fontSize: 15,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#8B0000',
    fontSize: 15,
    fontWeight: '800',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: 16,
  },
  paymentDetail: {
    color: '#8B0000',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
    opacity: 0.8,
  },
  changePaymentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8B0000',
    borderRadius: 12,
  },
  changePaymentText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  detailedBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  detailedBenefitText: {
    color: '#8B0000',
    fontSize: 15,
    flex: 1,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#8B0000',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 10,
    letterSpacing: 0.5,
  },
});