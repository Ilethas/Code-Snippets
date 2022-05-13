void AMyActor::CallBPFunction()
{
	UFunction* FuncPtr = FindFunction("My Function");
	struct
	{
		AActor* SomeActor;
		int SomeInt;
		UObject* ReturnValue = nullptr;
	} FuncParams;

	FuncParams.SomeActor = this;
	FuncParams.SomeInt = 42;

	TArray<FProperty*> Properties;
	TArray<FProperty*> InParams;
	TArray<FProperty*> OutParams;
	for (TFieldIterator<FProperty> It(FuncPtr); It && (It->PropertyFlags & CPF_Parm); ++It)
	{
		Properties.Add(*It);
		if (It->PropertyFlags & CPF_OutParm)
		{
			OutParams.Add(*It);
		}
		else
		{
			InParams.Add(*It);
		}
	}

	if (FuncPtr && InParams.Num() == 2 && OutParams.Num() == 1)
	{
		FObjectProperty* SomeActorProperty = CastField<FObjectProperty>(InParams[0]);
		FIntProperty* SomeIntProperty = CastField<FIntProperty>(InParams[1]);
		FObjectProperty* ObjectReturnProperty = CastField<FObjectProperty>(OutParams[0]);

		if (SomeActorProperty && SomeActorProperty->PropertyClass == AActor::StaticClass() && SomeIntProperty &&
			ObjectReturnProperty && ObjectReturnProperty->PropertyClass == UObject::StaticClass())
		{
			ProcessEvent(FuncPtr, &FuncParams);
		}
	}
}
