import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflow;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflowClientBuilder;
import com.amazonaws.services.simpleworkflow.model.*;

public class Starter
{
    private static ProfileCredentialsProvider credentials = new ProfileCredentialsProvider("default_admin");
    private static final AmazonSimpleWorkflow simpleWorkflow
            = AmazonSimpleWorkflowClientBuilder.standard().withCredentials(credentials).build() ;

    public static final String WORKFLOW_EXECUTION = "ExampleWorkflowExecution";

    public static void main(String[] args) {
        String workflow_input = "Amazon SWF";
        if (args.length > 0) {
            workflow_input = args[0];
        }

        System.out.println("Starting the workflow execution '" + WORKFLOW_EXECUTION +
                "' with input '" + workflow_input + "'.");

        WorkflowType wf_type = new WorkflowType()
                .withName(Types.WORKFLOW)
                .withVersion(Types.WORKFLOW_VERSION);

        Run run = simpleWorkflow.startWorkflowExecution(new StartWorkflowExecutionRequest()
                .withDomain(Types.DOMAIN)
                .withWorkflowType(wf_type)
                .withWorkflowId(WORKFLOW_EXECUTION)
                .withTaskStartToCloseTimeout("30")
                .withInput(workflow_input)
                .withExecutionStartToCloseTimeout("5000"));

        System.out.println("Workflow execution started with the run id '" +
                run.getRunId() + "'.");
    }

}