import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddExpenseModal = ({ 
  visible, 
  onClose, 
  onSave 
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Pre-defined categories for quick selection
  const categories = [
    { name: 'Food', icon: 'restaurant', color: '#F59E0B' },
    { name: 'Transport', icon: 'car', color: '#3B82F6' },
    { name: 'Shopping', icon: 'bag', color: '#EF4444' },
    { name: 'Entertainment', icon: 'game-controller', color: '#8B5CF6' },
    { name: 'Health', icon: 'medical', color: '#10B981' },
    { name: 'Bills', icon: 'receipt', color: '#F97316' },
    { name: 'Education', icon: 'school', color: '#06B6D4' },
    { name: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
  ];

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    // Validation
    if (!amount || !category || !date) {
      Alert.alert('Error', 'Please fill in all required fields (Amount, Category, and Date)');
      return;
    }

    // Validate amount is a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    // Create expense object
    const newExpense = {
      id: Date.now().toString(),
      amount: numAmount,
      category: category.trim(),
      date: date.trim(),
      description: description.trim(),
      timestamp: new Date().toISOString(),
    };

    // Call parent save function
    onSave(newExpense);
    
    // Reset form and close modal
    resetForm();
    onClose();
  };

  const selectCategory = (categoryName) => {
    setCategory(categoryName);
  };

  const formatDate = (text) => {
    // Auto-format date as MM/DD/YYYY
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    
    if (match) {
      let formatted = '';
      if (match[1]) formatted += match[1];
      if (match[2]) formatted += '/' + match[2];
      if (match[3]) formatted += '/' + match[3];
      return formatted;
    }
    return text;
  };

  const handleDateChange = (text) => {
    const formatted = formatDate(text);
    setDate(formatted);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const setTodayDate = () => {
    setDate(getCurrentDate());
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {/* Amount Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Amount <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Category Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.name}
                      style={[
                        styles.categoryButton,
                        category === cat.name && styles.categoryButtonSelected
                      ]}
                      onPress={() => selectCategory(cat.name)}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                        <Ionicons 
                          name={cat.icon} 
                          size={20} 
                          color={cat.color} 
                        />
                      </View>
                      <Text style={[
                        styles.categoryText,
                        category === cat.name && styles.categoryTextSelected
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Custom Category Input (if Other is selected) */}
              {category === 'Other' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Custom Category</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter custom category"
                    value={category === 'Other' ? '' : category}
                    onChangeText={setCategory}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              )}

              {/* Date Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Date <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="MM/DD/YYYY"
                    value={date}
                    onChangeText={handleDateChange}
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                    maxLength={10}
                  />
                  <TouchableOpacity
                    style={styles.todayButton}
                    onPress={setTodayDate}
                  >
                    <Text style={styles.todayButtonText}>Today</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description Input (Optional) */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add a note about this expense..."
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4F46E5',
    paddingLeft: 16,
    paddingRight: 4,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  categoryButtonSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  todayButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddExpenseModal;