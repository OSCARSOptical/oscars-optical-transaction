
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { NA_TRANSACTION_TYPES } from '../constants';

interface UseOrderDetailsProps {
  initialType?: Transaction['type'];
  onTypeChange?: (type: Transaction['type']) => void;
  onDateChange?: (date: Date) => void;
  initialData?: {
    transactionType?: Transaction['type'];
    transactionDate?: string;
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    frameType?: string;
    orderNotes?: string;
  };
  onPricesChange?: (prices: { 
    lensCapital: number; 
    edgingPrice: number; 
    otherExpenses: number 
  }) => void;
  onOrderDataChange?: (data: {
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    frameType?: string;
    orderNotes?: string;
  }) => void;
}

export const useOrderDetails = ({
  initialType,
  onTypeChange,
  onDateChange,
  initialData = {},
  onPricesChange,
  onOrderDataChange
}: UseOrderDetailsProps) => {
  const [transactionType, setTransactionType] = useState(initialData.transactionType || "");
  const [transactionDate, setTransactionDate] = useState(
    initialData.transactionDate ? new Date(initialData.transactionDate) : new Date()
  );
  const [refractiveIndex, setRefractiveIndex] = useState(initialData.refractiveIndex || "");
  const [lensType, setLensType] = useState(initialData.lensType || "");
  const [lensCoating, setLensCoating] = useState(initialData.lensCoating || "");
  const [tint, setTint] = useState(initialData.tint || "");
  const [frameType, setFrameType] = useState(initialData.frameType || "");
  const [color, setColor] = useState(initialData.color || "");
  const [notes, setNotes] = useState(initialData.orderNotes || "");

  const shouldDisableFields = NA_TRANSACTION_TYPES.includes(transactionType);
  const showColorField = tint === "One-Tone" || tint === "Two-Tone";

  useEffect(() => {
    if (shouldDisableFields) {
      setRefractiveIndex("N/A");
      setLensType("N/A");
      setLensCoating("N/A");
      setTint("N/A");
      setFrameType("N/A");
    } else {
      if (refractiveIndex === "N/A") setRefractiveIndex("");
      if (lensType === "N/A") setLensType("");
      if (lensCoating === "N/A") setLensCoating("");
      if (tint === "N/A") setTint("");
      if (frameType === "N/A") setFrameType("");
    }
  }, [transactionType, shouldDisableFields]);

  useEffect(() => {
    if (!shouldDisableFields && refractiveIndex && lensType && lensCoating && tint && frameType) {
      const prices = getPricesForCombination(
        refractiveIndex,
        lensType,
        lensCoating,
        tint,
        frameType
      );
      if (onPricesChange) {
        onPricesChange(prices);
      }
    }
  }, [refractiveIndex, lensType, lensCoating, tint, frameType, shouldDisableFields, onPricesChange]);

  useEffect(() => {
    if (onOrderDataChange) {
      onOrderDataChange({
        refractiveIndex,
        lensType,
        lensCoating,
        tint,
        color,
        frameType,
        orderNotes: notes
      });
    }
  }, [refractiveIndex, lensType, lensCoating, tint, color, frameType, notes, onOrderDataChange]);

  const handleTypeChange = (value: Transaction['type']) => {
    setTransactionType(value);
    if (onTypeChange) {
      onTypeChange(value);
    }
  };

  const handleDateChange = (date: Date) => {
    setTransactionDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  return {
    transactionType,
    transactionDate,
    refractiveIndex,
    lensType,
    lensCoating,
    tint,
    frameType,
    color,
    notes,
    shouldDisableFields,
    showColorField,
    handleTypeChange,
    handleDateChange,
    setRefractiveIndex,
    setLensType,
    setLensCoating,
    setTint,
    setFrameType,
    setColor,
    setNotes
  };
};
