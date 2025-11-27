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
          
          <TouchableOpacity style={styles.changeButton}>
            <Ionicons name="swap-horizontal-outline" size={20} color="#8B3A2D" />
            <Text style={styles.changeButtonText}>Trocar Assinatura</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Benefícios */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>BENEFÍCIOS INCLUÍDOS</Text>
          <View style={styles.benefitsList}>
            {beneficios.map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark" size={16} color="#8B3A2D" />
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
                <Ionicons name="close" size={24} color="#8B3A2D" />
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
                  <Ionicons name="card-outline" size={20} color="#8B3A2D" />
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
                    <Ionicons name="checkmark-circle" size={20} color="#8B3A2D" />
                    <Text style={styles.detailedBenefitText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Botão de Assinar/Confirmar */}
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar Assinatura</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B3A2D',
  },
  card: {
    backgroundColor: "#8B3A2D",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPrice: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardInfo: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
  },
  infoBold: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    gap: 8,
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontWeight: '600',
  },
  changeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B3A2D',
    gap: 8,
  },
  changeButtonText: {
    color: '#8B3A2D',
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  benefitsTitle: {
    color: "#8B3A2D",
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: "#333",
    fontSize: 14,
  },
  signButton: {
    backgroundColor: '#8B3A2D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  signButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B3A2D',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    color: '#666',
    fontSize: 14,
  },
  summaryValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  paymentDetail: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  changePaymentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changePaymentText: {
    color: '#8B3A2D',
    fontWeight: '600',
    fontSize: 12,
  },
  detailedBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  detailedBenefitText: {
    color: '#333',
    fontSize: 14,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#8B3A2D',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});