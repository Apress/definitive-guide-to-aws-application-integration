import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflow;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflowClientBuilder;
import com.amazonaws.services.simpleworkflow.model.RegisterDomainRequest;

public class RegisterDomain {
    public static void main(String... args) {
        AmazonSimpleWorkflow simpleWorkflow = AmazonSimpleWorkflowClientBuilder.defaultClient();
        RegisterDomainRequest request = new RegisterDomainRequest();
        request.setName("OrdersDomain_3");
        request.setWorkflowExecutionRetentionPeriodInDays("7");
        simpleWorkflow.registerDomain(request);
    }
}